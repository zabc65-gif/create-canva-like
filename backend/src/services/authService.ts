import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export class AuthService {
  /**
   * Enregistrer un nouvel utilisateur
   */
  static async register(email: string, password: string, username: string): Promise<{ user: User; token: string }> {
    // Vérifier si l'email existe déjà
    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userId = uuidv4();
    await dbRun(
      'INSERT INTO users (id, email, password, username) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, username]
    );

    // Récupérer l'utilisateur créé
    const user = await dbGet(
      'SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    ) as User;

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { user, token };
  }

  /**
   * Connexion utilisateur
   */
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Récupérer l'utilisateur
    const user = await dbGet(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as UserWithPassword | undefined;

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Vérifier un token JWT
   */
  static verifyToken(token: string): { userId: string; email: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const user = await dbGet(
      'SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    ) as User | undefined;

    return user || null;
  }
}
