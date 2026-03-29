import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.service.js';

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECREAT,
    { expiresIn: '7d' }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const user = await authService.registerUser(name, email, password);
    const token = generateToken(user._id);
    
    setTokenCookie(res, token);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth:Register] Error:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Registration failed. Please try again.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await authService.loginUser(email, password);
    const token = generateToken(user._id);
    
    setTokenCookie(res, token);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        message: "Login successful"
      },
    });
  } catch (error) {
    console.error('[Auth:Login] Error:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Login failed. Please try again.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
export const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return res.status(200).json({ message: 'Successfully logged out.' });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me   (protected)
// ─────────────────────────────────────────────────────────────────────────────
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the identifyUser middleware
    const user = await authService.getUserById(req.user.id);
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth:Me] Error:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || 'Failed to fetch user.', error: error.message });
  }
};
