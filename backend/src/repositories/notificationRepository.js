class NotificationRepository {
  constructor(dbContext) {
    this.Notification = dbContext.Notification;
  }

  create(data) {
    return this.Notification.create(data);
  }

  findForUser(userId, { limit = 50 } = {}) {
    return this.Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
  }

  findAll({ channel, type, limit = 100 } = {}) {
    const filter = {};
    if (channel) filter.channel = channel;
    if (type) filter.type = type;
    return this.Notification.find(filter).sort({ createdAt: -1 }).limit(limit).populate('user', 'name email');
  }

  markRead(id, userId) {
    return this.Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { readAt: new Date() },
      { new: true }
    );
  }
}

module.exports = NotificationRepository;
