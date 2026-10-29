import app from './app.js';
import { connectDB } from './config/db.js';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🌾 Kisan Market Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed Client: ${CLIENT_URL}`);
});

export default server;
