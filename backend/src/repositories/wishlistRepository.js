class WishlistRepository {
  constructor(dbContext) {
    this.Wishlist = dbContext.Wishlist;
  }

  findByUser(userId) {
    return this.Wishlist.findOne({ user: userId }).populate('products');
  }

  upsert(userId, products) {
    return this.Wishlist.findOneAndUpdate(
      { user: userId },
      { user: userId, products },
      { new: true, upsert: true }
    ).populate('products');
  }
}

module.exports = WishlistRepository;
