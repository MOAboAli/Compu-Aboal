class PaymentSimulator {
  async charge({ amount, currency = 'SAR', methodCode, orderNumber, metadata = {} }) {
    const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      simulated: true,
      reference,
      amount,
      currency,
      methodCode,
      orderNumber,
      paidAt: new Date(),
      metadata,
    };
  }
}

module.exports = PaymentSimulator;
