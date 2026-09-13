const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');
const { httpError } = require('../utils/httpError');
const { randomToken, randomCode } = require('../utils/ids');
const { validateCustomerProfile, assertPassword } = require('../utils/accountValidation');

class AuthService {
  constructor({ userRepository, emailSimulator, smsSimulator }) {
    this.userRepository = userRepository;
    this.emailSimulator = emailSimulator;
    this.smsSimulator = smsSimulator;
  }

  async register(payload) {
    const data = validateCustomerProfile(payload, { requirePassword: true });
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw httpError('Email already registered', 409);

    const emailVerifyToken = randomToken();
    const phoneVerifyCode = randomCode();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: 'customer',
      accountType: data.accountType,
      primaryAddress: data.primaryAddress,
      companyAddress: data.companyAddress,
      companyWebsite: data.companyWebsite,
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

    user.passwordHash = await bcrypt.hash(assertPassword(password), 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return { message: 'Password reset successful' };
  }

  me(user) {
    return user.toSafeObject();
  }

  async updateProfile(user, payload) {
    const data = validateCustomerProfile(
      {
        ...payload,
        email: payload.email ?? user.email,
        firstName: payload.firstName ?? user.firstName,
        lastName: payload.lastName ?? user.lastName,
        phone: payload.phone ?? user.phone,
        accountType: payload.accountType ?? user.accountType,
        primaryAddress: payload.primaryAddress ?? user.primaryAddress,
        companyAddress: payload.companyAddress ?? user.companyAddress,
        companyWebsite: payload.companyWebsite ?? user.companyWebsite,
      },
      { requirePassword: false }
    );

    if (data.email !== user.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && String(existing._id) !== String(user._id)) {
        throw httpError('Email already registered', 409);
      }
    }

    const updated = await this.userRepository.updateById(user._id, {
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
      accountType: data.accountType,
      primaryAddress: data.primaryAddress || {},
      companyAddress: data.accountType === 'company' ? data.companyAddress : '',
      companyWebsite: data.accountType === 'company' ? data.companyWebsite : '',
    });
    if (!updated) throw httpError('User not found', 404);
    return updated.toSafeObject();
  }

  async changePassword(user, { currentPassword, password }) {
    const ok = await bcrypt.compare(String(currentPassword || ''), user.passwordHash);
    if (!ok) throw httpError('Current password is incorrect', 401);
    const next = assertPassword(password);
    const updated = await this.userRepository.updateById(user._id, {
      passwordHash: await bcrypt.hash(next, 10),
    });
    return { message: 'Password updated', user: updated.toSafeObject() };
  }
}

module.exports = AuthService;
