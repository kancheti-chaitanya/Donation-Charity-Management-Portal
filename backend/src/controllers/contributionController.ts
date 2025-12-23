import pool from '../config/database';
import { Request, Response } from 'express';

export const createContribution = async (req: Request, res: Response) => {
  try {
    const donorId = req.user?.userId;
    const { donationId, amount, notes } = req.body;

    if (!donorId || req.user?.role !== 'Donor') {
      return res.status(403).json({ message: 'Only donors can contribute' });
    }

    if (!donationId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const connection = await pool.getConnection();

    // Check if donation exists
    const [donations]: any = await connection.query('SELECT id FROM donations WHERE id = ?', [donationId]);
    if (donations.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Create contribution
    const [result]: any = await connection.query(
      'INSERT INTO contributions (donation_id, donor_id, amount, notes, contributed_at) VALUES (?, ?, ?, ?, NOW())',
      [donationId, donorId, amount, notes || '']
    );

    connection.release();

    res.status(201).json({
      message: 'Contribution created successfully',
      contribution: { id: result.insertId, donationId, amount },
    });
  } catch (error) {
    console.error('Create contribution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getContributions = async (req: Request, res: Response) => {
  try {
    const { donationId, donorId } = req.query;

    let query = 'SELECT c.*, d.donation_type, u.name as donor_name FROM contributions c JOIN donations d ON c.donation_id = d.id JOIN users u ON c.donor_id = u.id WHERE 1=1';
    const params: any[] = [];

    if (donationId) {
      query += ' AND c.donation_id = ?';
      params.push(donationId);
    }

    if (donorId) {
      query += ' AND c.donor_id = ?';
      params.push(donorId);
    }

    query += ' ORDER BY c.contributed_at DESC';

    const connection = await pool.getConnection();
    const [contributions]: any = await connection.query(query, params);
    connection.release();

    res.status(200).json({ contributions });
  } catch (error) {
    console.error('Get contributions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonorContributions = async (req: Request, res: Response) => {
  try {
    const donorId = req.user?.userId;

    if (!donorId || req.user?.role !== 'Donor') {
      return res.status(403).json({ message: 'Only donors can access this' });
    }

    const connection = await pool.getConnection();
    const [contributions]: any = await connection.query(
      'SELECT c.*, d.donation_type, d.location, d.ngo_id FROM contributions c JOIN donations d ON c.donation_id = d.id WHERE c.donor_id = ? ORDER BY c.contributed_at DESC',
      [donorId]
    );
    connection.release();

    res.status(200).json({ contributions });
  } catch (error) {
    console.error('Get donor contributions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
