import pool from '../config/database';
import { Request, Response } from 'express';

export const schedulePickup = async (req: Request, res: Response) => {
  try {
    const { donationId, pickupDate, pickupTime, notes } = req.body;
    const donorId = req.user?.userId;

    if (!donationId || !pickupDate || !pickupTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const connection = await pool.getConnection();

    // Check if donation exists
    const [donations]: any = await connection.query('SELECT * FROM donations WHERE id = ?', [donationId]);
    if (donations.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Donation not found' });
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    if (pickupDateTime <= new Date()) {
      connection.release();
      return res.status(400).json({ message: 'Pickup date/time must be in the future' });
    }

    // Create pickup schedule
    const [result]: any = await connection.query(
      'INSERT INTO pickups (donation_id, donor_id, pickup_date, pickup_time, notes, status, scheduled_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [donationId, donorId, pickupDate, pickupTime, notes || '', 'Scheduled']
    );

    // Update donation status to Confirmed
    await connection.query('UPDATE donations SET status = ? WHERE id = ?', ['Confirmed', donationId]);

    connection.release();

    res.status(201).json({
      message: 'Pickup scheduled successfully',
      pickup: { id: result.insertId, donationId, pickupDate, pickupTime },
    });
  } catch (error) {
    console.error('Schedule pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPickups = async (req: Request, res: Response) => {
  try {
    const { donationId, status } = req.query;

    let query = 'SELECT p.*, d.donation_type, d.location, u.name as donor_name FROM pickups p JOIN donations d ON p.donation_id = d.id JOIN users u ON p.donor_id = u.id WHERE 1=1';
    const params: any[] = [];

    if (donationId) {
      query += ' AND p.donation_id = ?';
      params.push(donationId);
    }

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.scheduled_at DESC';

    const connection = await pool.getConnection();
    const [pickups]: any = await connection.query(query, params);
    connection.release();

    res.status(200).json({ pickups });
  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePickupStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const connection = await pool.getConnection();

    // Check authorization (NGO or the donor)
    const [pickups]: any = await connection.query(
      'SELECT p.*, d.ngo_id FROM pickups p JOIN donations d ON p.donation_id = d.id WHERE p.id = ?',
      [id]
    );

    if (pickups.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Pickup not found' });
    }

    if (pickups[0].ngo_id !== userId && pickups[0].donor_id !== userId) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized' });
    }

    await connection.query('UPDATE pickups SET status = ? WHERE id = ?', [status, id]);
    connection.release();

    res.status(200).json({ message: 'Pickup status updated successfully' });
  } catch (error) {
    console.error('Update pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNGOPickups = async (req: Request, res: Response) => {
  try {
    const ngoId = req.user?.userId;

    if (req.user?.role !== 'NGO') {
      return res.status(403).json({ message: 'Only NGOs can access this' });
    }

    const connection = await pool.getConnection();
    const [pickups]: any = await connection.query(
      'SELECT p.*, d.donation_type, d.location, u.name as donor_name FROM pickups p JOIN donations d ON p.donation_id = d.id JOIN users u ON p.donor_id = u.id WHERE d.ngo_id = ? ORDER BY p.scheduled_at DESC',
      [ngoId]
    );
    connection.release();

    res.status(200).json({ pickups });
  } catch (error) {
    console.error('Get NGO pickups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonorPickups = async (req: Request, res: Response) => {
  try {
    const donorId = req.user?.userId;

    if (req.user?.role !== 'Donor') {
      return res.status(403).json({ message: 'Only donors can access this' });
    }

    const connection = await pool.getConnection();
    const [pickups]: any = await connection.query(
      'SELECT p.*, d.donation_type, d.location FROM pickups p JOIN donations d ON p.donation_id = d.id WHERE p.donor_id = ? ORDER BY p.scheduled_at DESC',
      [donorId]
    );
    connection.release();

    res.status(200).json({ pickups });
  } catch (error) {
    console.error('Get donor pickups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
