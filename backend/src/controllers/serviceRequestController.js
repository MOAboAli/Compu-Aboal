class ServiceRequestController {
  constructor(serviceRequestService) {
    this.serviceRequestService = serviceRequestService;
  }

  create = async (req, res) => {
    try {
      const body = { ...req.body };
      if (typeof body.address === 'string') {
        try {
          body.address = JSON.parse(body.address);
        } catch (_) {
          /* keep string */
        }
      }
      res
        .status(201)
        .json(await this.serviceRequestService.create(req.user, body, req.files || []));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listMine = async (req, res) => {
    try {
      res.json(await this.serviceRequestService.listMine(req.user._id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listAll = async (req, res) => {
    try {
      res.json(await this.serviceRequestService.listAll(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.serviceRequestService.getById(req.params.id, req.user));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  updateStatus = async (req, res) => {
    try {
      res.json(
        await this.serviceRequestService.updateStatus(req.params.id, req.body.status, req.body)
      );
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  addAttachments = async (req, res) => {
    try {
      res.json(
        await this.serviceRequestService.addAttachments(req.params.id, req.user, req.files || [])
      );
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = ServiceRequestController;
