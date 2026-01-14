// MongoDB Initialization Script
// This script runs when the MongoDB container is first created

// Switch to admin database
db = db.getSiblingDB('admin');

// Create application databases
const databases = ['ecommerce'];

databases.forEach((dbName) => {
  print(`Creating database: ${dbName}`);
  db = db.getSiblingDB(dbName);

  // Create a placeholder collection to ensure database is created
  db.createCollection('_init');

  // Create indexes for common queries
  if (dbName === 'ecommerce') {
    db.products.createIndex({ name: 'text', description: 'text' });
    db.products.createIndex({ category: 1 });
    db.products.createIndex({ price: 1 });
    db.products.createIndex({ createdAt: -1 });
  }

  if (dbName === 'ecommerce') {
    db.orders.createIndex({ userId: 1 });
    db.orders.createIndex({ status: 1 });
    db.orders.createIndex({ createdAt: -1 });
  }

  if (dbName === 'ecommerce') {
    db.users.createIndex({ email: 1 }, { unique: true });
    db.users.createIndex({ role: 1 });
  }

  if (dbName === 'ecommerce') {
    db.categories.createIndex({ slug: 1 }, { unique: true });
    db.categories.createIndex({ parentId: 1 });
  }

  if (dbName === 'ecommerce') {
    db.coupons.createIndex({ code: 1 }, { unique: true });
    db.coupons.createIndex({ expiresAt: 1 });
  }
});

print('MongoDB initialization completed successfully!');
