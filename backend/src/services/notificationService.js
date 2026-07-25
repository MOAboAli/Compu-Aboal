class NotificationService {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  listMine(userId, query = {}) {
    return this.notificationRepository.findForUser(userId, {
      limit: Number(query.limit) || 50,
    });
  }

  listAll(query = {}) {
    return this.notificationRepository.findAll(query);
  }

  markRead(id, userId) {
    return this.notificationRepository.markRead(id, userId);
  }
}

module.exports = NotificationService;
