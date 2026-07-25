const { httpError } = require('../utils/httpError');

class CartService {
  constructor({ cartRepository, productRepository }) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async getCart(userId) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) return { user: userId, items: [] };
    const items = (cart.items || []).map((line) => ({
      productId: line.product?._id || line.product,
      name: line.product?.name || 'Product',
      quantity: line.quantity,
      price: line.price,
      product: line.product,
    }));
    return { ...cart.toObject(), items };
  }

  async addItem(userId, { productId, quantity = 1 }) {
    const product = await this.productRepository.findById(productId);
    if (!product || product.status !== 'active') throw httpError('Product not available', 404);

    const cart = (await this.cartRepository.findByUser(userId)) || { items: [] };
    const items = [...(cart.items || []).map((i) => ({
      product: i.product._id || i.product,
      quantity: i.quantity,
      price: i.price,
    }))];

    const idx = items.findIndex((i) => String(i.product) === String(productId));
    const unit = product.discountPrice != null ? product.discountPrice : product.price;
    if (idx >= 0) items[idx].quantity += Number(quantity);
    else items.push({ product: productId, quantity: Number(quantity), price: unit });

    return this.cartRepository.upsert(userId, items);
  }

  async updateItem(userId, productId, quantity) {
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) throw httpError('Cart is empty', 404);

    const items = cart.items
      .map((i) => ({
        product: i.product._id || i.product,
        quantity: i.quantity,
        price: i.price,
      }))
      .filter((i) => String(i.product) !== String(productId) || Number(quantity) > 0)
      .map((i) =>
        String(i.product) === String(productId) ? { ...i, quantity: Number(quantity) } : i
      );

    return this.cartRepository.upsert(userId, items);
  }

  async removeItem(userId, productId) {
    return this.updateItem(userId, productId, 0);
  }

  async clear(userId) {
    return this.cartRepository.clear(userId);
  }
}

module.exports = CartService;
