const mongoose = require('mongoose');

// MongoDB connection using Mongoose
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(() => {
  console.log('MongoDB connection successful.');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

module.exports = { mongoose };