require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const axios = require('axios');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', require('./routes/test'));
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/defaulters', require('./routes/defaulter'));
app.use('/api/super-admin', require('./routes/super-admin'));
app.use('/api/Linkedin-jobs', require('./routes/jobs'));
app.use('/api/admin-manag', require('./routes/admin-managment'));

// Root route
app.get('/', (req, res) => res.send('University Skill Backend is running'));

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
});


// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/university';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    startKeepAliveCron();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

  const pingServer = async () => {
  try {
    const baseUrl = process.env.RENDER_URL || `http://localhost:${PORT}`;
    const response = await axios.get(`${baseUrl}/health`);
    console.log(`Keep-alive ping successful: ${response.status} - ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Keep-alive ping failed:', error.message);
  }
};

// Start keep-alive cron job
const startKeepAliveCron = () => {
  // Run every 14 minutes (Render sleeps after 15 minutes of inactivity)
  cron.schedule('*/14 * * * *', () => {
    console.log('Running keep-alive cron job...');
    pingServer();
  });
  
  console.log('Keep-alive cron job scheduled');
};
