class SmsSimulator {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async send({ to, body, userId = null, type = 'sms', meta = {} }) {
    const doc = await this.notificationRepository.create({
      user: userId,
      channel: 'sms',
      type,
      subject: '',
      body,
      to,
      status: 'sent',
      meta: { ...meta, simulated: true },
    });
    return { success: true, simulated: true, notificationId: doc._id };
  }
}

module.exports = SmsSimulator;
