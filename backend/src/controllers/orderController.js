class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  checkout = async (req, res) => {
    try {
      res.status(201).json(await this.orderService.checkout(req.user, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  pay = async (req, res) => {
    try {
      res.json(await this.orderService.pay(req.params.id, req.user, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listMine = async (req, res) => {
    try {
      res.json(await this.orderService.listMine(req.user._id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listAll = async (req, res) => {
    try {
      res.json(await this.orderService.listAll(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.orderService.getById(req.params.id, req.user));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  updateStatus = async (req, res) => {
    try {
      res.json(await this.orderService.updateStatus(req.params.id, req.body.status));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = OrderController;
