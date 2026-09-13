const mongoose = require('mongoose');

const ROLES = [
  'super_admin',
  'admin',
  'service_manager',
  'sales_manager',
  'customer_support',
  'customer',
];

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    zip: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'Egypt' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: 'customer' },
    accountType: { type: String, enum: ['personal', 'company'], default: 'personal' },
    primaryAddress: { type: addressSchema, default: undefined },
    companyAddress: { type: String, trim: true, default: '' },
    companyWebsite: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, default: null },
    phoneVerifyCode: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre('validate', function syncName(next) {
  if (!this.firstName && this.name) {
    const parts = String(this.name).trim().split(/\s+/).filter(Boolean);
    this.firstName = parts[0] || '';
    this.lastName = parts.slice(1).join(' ') || '';
  }
  const full = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  if (full) this.name = full;
  next();
});

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.emailVerifyToken;
  delete obj.phoneVerifyCode;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  if (!obj.firstName && obj.name) {
    const parts = String(obj.name).trim().split(/\s+/).filter(Boolean);
    obj.firstName = parts[0] || '';
    obj.lastName = parts.slice(1).join(' ') || '';
  }
  return obj;
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
