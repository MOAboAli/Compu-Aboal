class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  list = async (req, res) => {
    try {
      res.json(await this.paymentService.list(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.paymentService.getById(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      res.status(201).json(await this.paymentService.create(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      res.json(await this.paymentService.update(req.params.id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      res.json(await this.paymentService.remove(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = PaymentController;
