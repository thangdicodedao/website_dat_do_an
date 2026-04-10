require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectDB();
    // Sync models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('✅ Models synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
