// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
const db = require('./models');
const { mongoose } = require('./config/db');


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

db.sequelize.authenticate()
  .then(() => console.log('MySQL connected...'))
  .catch(err => console.error('Error connecting to MySQL:', err));

// Mongoose (MongoDB)
mongoose.connection.once('open', () => {
  console.log('MongoDB connected...');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
const loginRouter = require('./routes/API/loginRouter');
const userRouter = require('./routes/API/user/userRouter');
app.use('/api', loginRouter);
app.use('/api/user', userRouter);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports = app;