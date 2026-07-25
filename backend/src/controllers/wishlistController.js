class WishlistController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
  }

  get = async (req, res) => {
    try {
      res.json(await this.wishlistService.get(req.user._id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  add = async (req, res) => {
    try {
      res.json(await this.wishlistService.add(req.user._id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      res.json(await this.wishlistService.remove(req.user._id, req.params.productId));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = WishlistController;
