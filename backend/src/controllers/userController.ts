import pool from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, contactInfo } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['Donor', 'NGO', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const connection = await pool.getConnection();

    // Check if email already exists
    const [existingUser]: any = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);

    // Insert user
    const [result]: any = await connection.query(
      'INSERT INTO users (name, email, password, role, contact_info, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, hashedPassword, role, contactInfo || '']
    );

    connection.release();

    const token = generateToken(result.insertId, role);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.insertId, name, email, role },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    const errorMessage = error?.message || 'Server error';
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [users]: any = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await pool.getConnection();
    const [users]: any = await connection.query(
      'SELECT id, name, email, role, contact_info, created_at FROM users WHERE id = ?',
      [userId]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, contactInfo } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET name = ?, contact_info = ? WHERE id = ?', [
      name,
      contactInfo,
      userId,
    ]);

    const [users]: any = await connection.query(
      'SELECT id, name, email, role, contact_info FROM users WHERE id = ?',
      [userId]
    );
    connection.release();

    res.status(200).json({ message: 'Profile updated', user: users[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
