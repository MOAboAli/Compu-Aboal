const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');
const { httpError } = require('../utils/httpError');
const { randomToken, randomCode } = require('../utils/ids');

class AuthService {
  constructor({ userRepository, emailSimulator, smsSimulator }) {
    this.userRepository = userRepository;
    this.emailSimulator = emailSimulator;
    this.smsSimulator = smsSimulator;
  }

  async register({ name, email, phone, password, role = 'customer' }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw httpError('Email already registered', 409);

    const emailVerifyToken = randomToken();
    const phoneVerifyCode = randomCode();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: role === 'customer' ? 'customer' : 'customer',
      emailVerifyToken,
      phoneVerifyCode,
    });

    await this.emailSimulator.send({
      to: user.email,
      subject: 'Verify your email',
      body: `Your verification token is ${emailVerifyToken}`,
      userId: user._id,
      type: 'email_verify',
      meta: { token: emailVerifyToken },
    });

    if (user.phone) {
      await this.smsSimulator.send({
        to: user.phone,
        body: `Your verification code is ${phoneVerifyCode}`,
        userId: user._id,
        type: 'phone_verify',
        meta: { code: phoneVerifyCode },
      });
    }

    return { user: user.toSafeObject(), token: signToken(user) };
  }

  async login({ email, password, phone }) {
    const identifier = email || phone;
    if (!identifier) throw httpError('Email or phone is required', 400);

    const user = await this.userRepository.findByLogin(identifier);
    if (!user) throw httpError('Invalid credentials', 401);
    if (!user.isActive) throw httpError('Account is inactive', 403);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw httpError('Invalid credentials', 401);

    return { user: user.toSafeObject(), token: signToken(user) };
  }

  async verifyEmail({ email, token }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw httpError('User not found', 404);
    if (user.emailVerifyToken !== token) throw httpError('Invalid verification token');

    user.emailVerified = true;
    user.emailVerifyToken = null;
    await user.save();
    return user.toSafeObject();
  }

  async verifyPhone({ email, code }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw httpError('User not found', 404);
    if (user.phoneVerifyCode !== code) throw httpError('Invalid verification code');

    user.phoneVerified = true;
    user.phoneVerifyCode = null;
    await user.save();
    return user.toSafeObject();
  }

  async forgotPassword({ email }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return { message: 'If the email exists, a reset link was sent' };

    const token = randomToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await this.emailSimulator.send({
      to: user.email,
      subject: 'Reset your password',
      body: `Your password reset token is ${token}`,
      userId: user._id,
      type: 'password_reset',
      meta: { token },
    });

    return { message: 'If the email exists, a reset link was sent', simulatedToken: token };
  }

  async resetPassword({ token, password }) {
    const user = await this.userRepository.findByResetToken(token);
    if (!user) throw httpError('Invalid or expired reset token');

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return { message: 'Password reset successful' };
  }

  me(user) {
    return user.toSafeObject();
  }
}

module.exports = AuthService;
