const mongoose = require('mongoose');

const ROLES = [
  'super_admin',
  'admin',
  'service_manager',
  'sales_manager',
  'customer_support',
  'customer',
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: 'customer' },
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

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.emailVerifyToken;
  delete obj.phoneVerifyCode;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
