class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  get = async (req, res) => {
    try {
      res.json(await this.cartService.getCart(req.user._id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  addItem = async (req, res) => {
    try {
      res.json(await this.cartService.addItem(req.user._id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  updateItem = async (req, res) => {
    try {
      res.json(
        await this.cartService.updateItem(req.user._id, req.params.productId, req.body.quantity)
      );
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  removeItem = async (req, res) => {
    try {
      res.json(await this.cartService.removeItem(req.user._id, req.params.productId));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  clear = async (req, res) => {
    try {
      res.json(await this.cartService.clear(req.user._id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = CartController;
