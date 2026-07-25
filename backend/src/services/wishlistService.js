const { httpError } = require('../utils/httpError');

class WishlistService {
  constructor({ wishlistRepository, productRepository }) {
    this.wishlistRepository = wishlistRepository;
    this.productRepository = productRepository;
  }

  async get(userId) {
    const wishlist = await this.wishlistRepository.findByUser(userId);
    const products = wishlist?.products || [];
    return {
      user: userId,
      items: products.map((p) => ({
        _id: p._id || p,
        productId: p._id || p,
        name: p.name || 'Product',
        product: p,
      })),
    };
  }

  async add(userId, { productId }) {
    const id = productId;
    const product = await this.productRepository.findById(id);
    if (!product) throw httpError('Product not found', 404);

    const wishlist = (await this.wishlistRepository.findByUser(userId)) || { products: [] };
    const products = wishlist.products.map((p) => p._id || p);
    if (!products.some((pid) => String(pid) === String(id))) {
      products.push(id);
    }
    return this.wishlistRepository.upsert(userId, products);
  }

  async remove(userId, productId) {
    const wishlist = (await this.wishlistRepository.findByUser(userId)) || { products: [] };
    const products = wishlist.products
      .map((p) => p._id || p)
      .filter((id) => String(id) !== String(productId));
    return this.wishlistRepository.upsert(userId, products);
  }
}

module.exports = WishlistService;
