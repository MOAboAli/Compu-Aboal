class UserRepository {
  constructor(dbContext) {
    this.User = dbContext.User;
  }

  create(data) {
    return this.User.create(data);
  }

  findById(id) {
    return this.User.findById(id);
  }

  findByEmail(email) {
    return this.User.findOne({ email: String(email).toLowerCase().trim() });
  }

  findByPhone(phone) {
    return this.User.findOne({ phone: String(phone).trim() });
  }

  findByLogin(identifier) {
    const value = String(identifier).trim();
    return this.User.findOne({
      $or: [{ email: value.toLowerCase() }, { phone: value }],
    });
  }

  findByResetToken(token) {
    return this.User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  findAll(filter = {}) {
    return this.User.find(filter).sort({ createdAt: -1 });
  }

  updateById(id, data) {
    return this.User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.User.findByIdAndDelete(id);
  }

  count(filter = {}) {
    return this.User.countDocuments(filter);
  }
}

module.exports = UserRepository;
