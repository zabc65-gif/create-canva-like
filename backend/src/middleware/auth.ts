import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';

// Étendre l'interface Request pour inclure userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware pour vérifier l'authentification JWT
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // Vérifier le token
    const decoded = AuthService.verifyToken(token);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
}

/**
 * Middleware optionnel - ajoute userId si token présent, mais ne bloque pas
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyToken(token);
      req.userId = decoded.userId;
    }

    next();
  } catch (error) {
    // Token invalide mais on continue quand même
    next();
  }
}
