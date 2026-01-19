import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authServiceMysql.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, mot de passe et nom d\'utilisateur requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Créer l'utilisateur
    const result = await AuthService.register(email, password, username);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    res.status(400).json({ error: error.message || 'Erreur lors de l\'inscription' });
  }
});

/**
 * POST /api/auth/login
 * Connexion utilisateur
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Se connecter
    const result = await AuthService.login(email, password);

    res.json({
      message: 'Connexion réussie',
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    console.error('Erreur connexion:', error);
    res.status(401).json({ error: error.message || 'Erreur lors de la connexion' });
  }
});

/**
 * GET /api/auth/me
 * Récupérer l'utilisateur connecté
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUserById(req.userId!);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
