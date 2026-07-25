const mongoose = require('mongoose');
const Product = require('../models/Product');

class DbContext {
  constructor() {
    this.Product = Product;
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
