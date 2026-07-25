const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
const ServiceCategory = require('../models/ServiceCategory');
const ServiceOffering = require('../models/ServiceOffering');
const ServiceRequest = require('../models/ServiceRequest');
const CmsBlock = require('../models/CmsBlock');
const PaymentMethod = require('../models/PaymentMethod');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const BackupJob = require('../models/BackupJob');

class DbContext {
  constructor() {
    this.User = User;
    this.Category = Category;
    this.Product = Product;
    this.Cart = Cart;
    this.Wishlist = Wishlist;
    this.Order = Order;
    this.ServiceCategory = ServiceCategory;
    this.ServiceOffering = ServiceOffering;
    this.ServiceRequest = ServiceRequest;
    this.CmsBlock = CmsBlock;
    this.PaymentMethod = PaymentMethod;
    this.Notification = Notification;
    this.AuditLog = AuditLog;
    this.BackupJob = BackupJob;
  }

  async connect(uri) {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  }

  get connection() {
    return mongoose.connection;
  }
}

module.exports = new DbContext();
