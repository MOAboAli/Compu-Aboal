const { httpError } = require('../utils/httpError');
const { requestNumber } = require('../utils/ids');
const { SERVICE_REQUEST_STATUSES } = require('../models/ServiceRequest');

class ServiceRequestService {
  constructor({
    serviceRequestRepository,
    serviceOfferingRepository,
    appointmentAvailabilityService,
    emailSimulator,
  }) {
    this.serviceRequestRepository = serviceRequestRepository;
    this.serviceOfferingRepository = serviceOfferingRepository;
    this.appointmentAvailabilityService = appointmentAvailabilityService;
    this.emailSimulator = emailSimulator;
  }

  async create(user, data, files = []) {
    if (!data.offering) {
      throw httpError('Please choose a service before booking an appointment');
    }

    const offering = await this.serviceOfferingRepository.findById(data.offering);
    if (!offering || offering.status === 'inactive') {
      throw httpError('Selected service was not found', 404);
    }

    const type = offering.type || data.type;
    if (!['site_survey', 'maintenance', 'other'].includes(type)) {
      throw httpError('Invalid service type');
    }

    const preferredDate = await this.appointmentAvailabilityService.assertDateBookable(
      data.preferredDate
    );

    const guestEmail = (data.email || data.guestEmail || user?.email || '').trim();
    const guestName = (data.name || data.guestName || user?.name || '').trim();
    const contactPhone = (data.contactPhone || user?.phone || '').trim();

    if (!user && (!guestEmail || !guestName || !contactPhone)) {
      throw httpError('Name, email, and phone are required');
    }

    const attachments = files.map((f) => `/uploads/${f.filename}`);
    let address = data.address || {};
    if (typeof address === 'string') {
      address = { line1: address, city: data.city || '', country: 'Egypt' };
    }

    const title =
      data.title ||
      (type === 'site_survey'
        ? `${offering.name} - ${address.line1 || 'location'}`
        : type === 'maintenance'
          ? `${offering.name} - ${data.deviceType || 'device'}`
          : `Appointment - ${offering.name}`);

    const descriptionParts = [
      data.description,
      data.issue,
      data.infrastructure,
      data.deviceType ? `Device: ${data.deviceType}` : '',
      data.serialNumber ? `Serial: ${data.serialNumber}` : '',
      data.buildingType ? `Building: ${data.buildingType}` : '',
      data.floors ? `Floors: ${data.floors}` : '',
    ].filter(Boolean);

    const request = await this.serviceRequestRepository.create({
      requestNumber: requestNumber(),
      user: user?._id || null,
      guestName: user ? '' : guestName,
      guestEmail: user ? '' : guestEmail,
      offering: offering._id,
      type,
      title,
      description: descriptionParts.join('\n'),
      preferredDate,
      address,
      contactPhone,
      attachments,
      notes: data.notes || '',
      status: 'Submitted',
    });

    await this.emailSimulator.send({
      to: guestEmail,
      subject: `Appointment ${request.requestNumber} submitted`,
      body: `Your appointment for "${offering.name}" was submitted.`,
      userId: user?._id || null,
      type: 'service_request_submitted',
      meta: { requestId: request._id, offeringId: offering._id },
    });

    return this.serviceRequestRepository.findById(request._id);
  }

  listMine(userId) {
    return this.serviceRequestRepository.findByUser(userId);
  }

  listAll(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    return this.serviceRequestRepository.findAll(filter);
  }

  async getById(id, user) {
    const request = await this.serviceRequestRepository.findById(id);
    if (!request) throw httpError('Service request not found', 404);
    const isStaff = ['super_admin', 'admin', 'service_manager', 'customer_support'].includes(
      user.role
    );
    if (!isStaff && String(request.user._id || request.user) !== String(user._id)) {
      throw httpError('Forbidden', 403);
    }
    return request;
  }

  async updateStatus(id, status, extra = {}) {
    if (!SERVICE_REQUEST_STATUSES.includes(status)) throw httpError('Invalid status');
    const payload = { status, ...extra };
    if (status === 'Scheduled' && extra.scheduledAt) payload.scheduledAt = extra.scheduledAt;
    const request = await this.serviceRequestRepository.updateById(id, payload);
    if (!request) throw httpError('Service request not found', 404);
    return request;
  }

  async addAttachments(id, user, files = []) {
    const request = await this.getById(id, user);
    const attachments = [
      ...(request.attachments || []),
      ...files.map((f) => `/uploads/${f.filename}`),
    ];
    return this.serviceRequestRepository.updateById(id, { attachments });
  }
}

module.exports = ServiceRequestService;
