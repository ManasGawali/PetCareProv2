const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Service = require('./Service');
const ServiceProvider = require('./ServiceProvider');
const Pet = require('./Pet');
const Booking = require('./Booking');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const TrackingUpdate = require('./TrackingUpdate');
const Payment = require('./Payment');

// Define associations
User.hasMany(Pet, { foreignKey: 'user_id', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

Service.hasMany(Booking, { foreignKey: 'service_id', as: 'bookings' });
Booking.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

ServiceProvider.hasMany(Booking, { foreignKey: 'provider_id', as: 'bookings' });
Booking.belongsTo(ServiceProvider, { foreignKey: 'provider_id', as: 'provider' });

Pet.hasMany(Booking, { foreignKey: 'pet_id', as: 'bookings' });
Booking.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });

User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cart_items' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_items' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

Service.hasMany(Review, { foreignKey: 'service_id', as: 'reviews' });
Review.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

Booking.hasMany(Review, { foreignKey: 'booking_id', as: 'reviews' });
Review.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

Booking.hasMany(TrackingUpdate, { foreignKey: 'booking_id', as: 'tracking_updates' });
TrackingUpdate.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

Booking.hasMany(Payment, { foreignKey: 'booking_id', as: 'payments' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = {
  sequelize,
  User,
  Service,
  ServiceProvider,
  Pet,
  Booking,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  TrackingUpdate,
  Payment
};