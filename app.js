// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models');
const { mongoose } = require('./config/mongo');
const setupWebSocketServer = require('./socket/websocket'); // Imported WebSocket setup

const app = express();
const server = http.createServer(app);

// Initialize WebSocket Server
setupWebSocketServer(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection for MySQL (Sequelize)
db.sequelize.authenticate()
  .then(() => console.log('MySQL connected...'))
  .catch(err => console.error('Error connecting to MySQL:', err));

// Database Connection for MongoDB (Mongoose)
mongoose.connection.once('open', () => {
  console.log('MongoDB connected...');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
const loginRouter = require('./routes/API/loginRouter');
const userRouter = require('./routes/API/user/userRouter');
const expertRouter = require('./routes/API/expert/expertRouter');
const adminRouter = require('./routes/web/adminRouter');
app.use('/api', loginRouter);
app.use('/api/user', userRouter);
app.use('/api/expert', expertRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

module.exports = app;