import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de connexion
pool.getConnection()
  .then((connection) => {
    console.log('✅ Connecté à la base de données MySQL');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Erreur connexion MySQL:', err.message);
  });

/**
 * Exécuter une requête SQL
 */
export async function query(sql: string, params?: any[]): Promise<any> {
  const [results] = await pool.execute(sql, params);
  return results;
}

/**
 * Récupérer une seule ligne
 */
export async function get(sql: string, params?: any[]): Promise<any> {
  const results = await query(sql, params);
  return results[0] || null;
}

/**
 * Récupérer toutes les lignes
 */
export async function all(sql: string, params?: any[]): Promise<any[]> {
  return await query(sql, params);
}

/**
 * Initialiser les tables
 */
export async function initDatabase() {
  try {
    // Table des utilisateurs
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Table des projets
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        data LONGTEXT NOT NULL,
        thumbnail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_updated_at (updated_at DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tables MySQL initialisées');
  } catch (error) {
    console.error('❌ Erreur initialisation MySQL:', error);
    throw error;
  }
}

export default pool;
