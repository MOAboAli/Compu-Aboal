const { httpError } = require('../utils/httpError');
const { ROLES } = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  list(query = {}) {
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
    return this.userRepository.findAll(filter).then((users) => users.map((u) => u.toSafeObject()));
  }

  async getById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw httpError('User not found', 404);
    return user.toSafeObject();
  }

  async create(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw httpError('Email already registered', 409);
    if (data.role && !ROLES.includes(data.role)) throw httpError('Invalid role');

    const passwordHash = await bcrypt.hash(data.password || 'ChangeMe123!', 10);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      role: data.role || 'customer',
      isActive: data.isActive !== false,
      passwordHash,
      emailVerified: !!data.emailVerified,
      phoneVerified: !!data.phoneVerified,
    });
    return user.toSafeObject();
  }

  async update(id, data) {
    const payload = { ...data };
    delete payload.password;
    delete payload.passwordHash;
    if (payload.role && !ROLES.includes(payload.role)) throw httpError('Invalid role');

    if (data.password) {
      payload.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepository.updateById(id, payload);
    if (!user) throw httpError('User not found', 404);
    return user.toSafeObject();
  }

  async setActive(id, isActive) {
    const user = await this.userRepository.updateById(id, { isActive });
    if (!user) throw httpError('User not found', 404);
    return user.toSafeObject();
  }

  async setRole(id, role) {
    if (!ROLES.includes(role)) throw httpError('Invalid role');
    const user = await this.userRepository.updateById(id, { role });
    if (!user) throw httpError('User not found', 404);
    return user.toSafeObject();
  }

  async remove(id) {
    const user = await this.userRepository.deleteById(id);
    if (!user) throw httpError('User not found', 404);
    return { message: 'User deleted' };
  }
}

module.exports = UserService;
