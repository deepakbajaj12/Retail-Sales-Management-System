const mongoose = require('mongoose');

let connected = false;

async function connectMongo() {
  if (connected) return mongoose.connection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });
  connected = true;
  console.log('MongoDB connected');
  return mongoose.connection;
}

module.exports = { connectMongo };
