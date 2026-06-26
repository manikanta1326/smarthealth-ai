const express = require('express');
const cors = require('cors');

// Import all feature routes
const authRoutes = require("./routes/authRoutes"); 
const profileRoutes = require('./routes/profileRoutes');
const todayLogRoutes = require('./routes/todayLogRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const chatbotRoutes = require("./routes/chatbotRoutes");
const symptomRoutes = require('./routes/symptomRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Admin route import

const app = express();

// Application Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base Root Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SmartHealth AI backend is running'
    });
});

// Register all API routes
app.use("/api/auth", authRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/today-log', todayLogRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use("/api/admin", adminRoutes); // Mounted admin route block together here

// Error Handler
app.use((err, req, res, next) => {
    if (err?.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Uploaded image is too large.'
        });
    }

    console.error(err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

module.exports = app;