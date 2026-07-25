const { httpError } = require('../utils/httpError');
const { requestNumber } = require('../utils/ids');
const { SERVICE_REQUEST_STATUSES } = require('../models/ServiceRequest');

class ServiceRequestService {
  constructor({ serviceRequestRepository, emailSimulator }) {
    this.serviceRequestRepository = serviceRequestRepository;
    this.emailSimulator = emailSimulator;
  }

  async create(user, data, files = []) {
    if (!['site_survey', 'maintenance'].includes(data.type)) {
      throw httpError('type must be site_survey or maintenance');
    }

    const attachments = files.map((f) => `/uploads/${f.filename}`);
    let address = data.address || {};
    if (typeof address === 'string') {
      address = { line1: address, city: data.city || '', country: 'Egypt' };
    }

    const title =
      data.title ||
      (data.type === 'site_survey'
        ? `Site survey - ${address.line1 || 'location'}`
        : `Maintenance - ${data.deviceType || 'device'}`);

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
      user: user._id,
      offering: data.offering || null,
      type: data.type,
      title,
      description: descriptionParts.join('\n'),
      preferredDate: data.preferredDate || null,
      address,
      contactPhone: data.contactPhone || user.phone || '',
      attachments,
      notes: data.notes || '',
      status: 'Submitted',
    });

    await this.emailSimulator.send({
      to: user.email,
      subject: `Service request ${request.requestNumber} submitted`,
      body: `Your ${data.type} request "${title}" was submitted.`,
      userId: user._id,
      type: 'service_request_submitted',
      meta: { requestId: request._id },
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
