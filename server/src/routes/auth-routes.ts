import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Authenrication failed' });
    }

    const secretKey = process.env.JWT_SECRET_KEY || '';
    const token = jwt.sign({ id: user.id, username }, secretKey, { expiresIn: '1d' });

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
