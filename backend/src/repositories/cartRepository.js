class CartRepository {
  constructor(dbContext) {
    this.Cart = dbContext.Cart;
  }

  findByUser(userId) {
    return this.Cart.findOne({ user: userId }).populate('items.product');
  }

  upsert(userId, items) {
    return this.Cart.findOneAndUpdate(
      { user: userId },
      { user: userId, items },
      { new: true, upsert: true, runValidators: true }
    ).populate('items.product');
  }

  clear(userId) {
    return this.Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true });
  }
}

module.exports = CartRepository;
