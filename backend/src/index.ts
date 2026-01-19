import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { projectRoutes } from './routes/projects.js';
import { uploadRoutes } from './routes/uploads.js';
import authRoutes from './routes/auth.js';
import userProjectsRoutes from './routes/userProjects.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initDatabase } from './services/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers uploadés
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userProjectsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Initialiser la base de données et démarrer le serveur
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Create API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

start();

export default app;
