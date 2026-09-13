class AppointmentAvailabilityController {
  constructor(appointmentAvailabilityService) {
    this.appointmentAvailabilityService = appointmentAvailabilityService;
  }

  getAvailability = async (req, res) => {
    try {
      res.json(await this.appointmentAvailabilityService.getAvailability(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listBlocked = async (req, res) => {
    try {
      res.json(await this.appointmentAvailabilityService.listBlocked(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  createBlocked = async (req, res) => {
    try {
      res
        .status(201)
        .json(await this.appointmentAvailabilityService.createBlocked(req.body, req.user));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  deleteBlocked = async (req, res) => {
    try {
      res.json(await this.appointmentAvailabilityService.deleteBlocked(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = AppointmentAvailabilityController;
