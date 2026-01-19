import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/create.db');

// Créer la connexion SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion DB:', err);
  } else {
    console.log('✅ Connecté à la base de données SQLite');
  }
});

// Promisifier les méthodes
export const dbRun = promisify(db.run.bind(db));
export const dbGet = promisify(db.get.bind(db));
export const dbAll = promisify(db.all.bind(db));

// Initialiser les tables
export async function initDatabase() {
  try {
    // Table des utilisateurs
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des projets
    await dbRun(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        data TEXT NOT NULL,
        thumbnail TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Index pour améliorer les performances
    await dbRun(`
      CREATE INDEX IF NOT EXISTS idx_projects_user_id
      ON projects(user_id)
    `);

    await dbRun(`
      CREATE INDEX IF NOT EXISTS idx_projects_updated_at
      ON projects(updated_at DESC)
    `);

    console.log('✅ Tables initialisées');
  } catch (error) {
    console.error('❌ Erreur initialisation DB:', error);
    throw error;
  }
}

export default db;
