class EmailSimulator {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async send({ to, subject, body, userId = null, type = 'email', meta = {} }) {
    const doc = await this.notificationRepository.create({
      user: userId,
      channel: 'email',
      type,
      subject,
      body,
      to,
      status: 'sent',
      meta: { ...meta, simulated: true },
    });
    return { success: true, simulated: true, notificationId: doc._id };
  }
}

module.exports = EmailSimulator;
