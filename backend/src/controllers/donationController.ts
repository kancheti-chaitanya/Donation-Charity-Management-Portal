import pool from '../config/database';
import { Request, Response } from 'express';

export const createDonation = async (req: Request, res: Response) => {
  try {
    const ngoId = req.user?.userId;
    const { donationType, quantity, location, pickupDateTime, images, priority } = req.body;

    if (!ngoId || req.user?.role !== 'NGO') {
      return res.status(403).json({ message: 'Only NGOs can create donations' });
    }

    if (!donationType || !quantity || !location || !pickupDateTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const pickupDate = new Date(pickupDateTime);
    if (pickupDate <= new Date()) {
      return res.status(400).json({ message: 'Pickup date must be in the future' });
    }

    const connection = await pool.getConnection();
    const [result]: any = await connection.query(
      'INSERT INTO donations (ngo_id, donation_type, quantity_or_amount, location, pickup_date_time, images, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [ngoId, donationType, quantity, location, pickupDateTime, images || '', priority || 'Normal', 'Pending']
    );

    connection.release();

    res.status(201).json({
      message: 'Donation request created successfully',
      donation: { id: result.insertId, ngoId, donationType, quantity, location, pickupDateTime },
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const { type, location, status } = req.query;

    let query = 'SELECT d.*, u.name as ngo_name, u.contact_info FROM donations d JOIN users u ON d.ngo_id = u.id WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND d.donation_type = ?';
      params.push(type);
    }

    if (location) {
      query += ' AND d.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (status) {
      query += ' AND d.status = ?';
      params.push(status);
    } else {
      query += ' AND d.status = "Pending"';
    }

    query += ' ORDER BY d.priority DESC, d.created_at DESC';

    const connection = await pool.getConnection();
    const [donations]: any = await connection.query(query, params);
    connection.release();

    res.status(200).json({ donations });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [donations]: any = await connection.query(
      'SELECT d.*, u.name as ngo_name, u.contact_info FROM donations d JOIN users u ON d.ngo_id = u.id WHERE d.id = ?',
      [id]
    );
    connection.release();

    if (donations.length === 0) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(200).json({ donation: donations[0] });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ngoId = req.user?.userId;
    const { donationType, quantity, location, pickupDateTime, images, priority, status } = req.body;

    const connection = await pool.getConnection();
    const [donations]: any = await connection.query('SELECT ngo_id FROM donations WHERE id = ?', [id]);

    if (donations.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donations[0].ngo_id !== ngoId) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (donationType) updates.push('donation_type = ?'), params.push(donationType);
    if (quantity) updates.push('quantity_or_amount = ?'), params.push(quantity);
    if (location) updates.push('location = ?'), params.push(location);
    if (pickupDateTime) updates.push('pickup_date_time = ?'), params.push(pickupDateTime);
    if (images) updates.push('images = ?'), params.push(images);
    if (priority) updates.push('priority = ?'), params.push(priority);
    if (status) updates.push('status = ?'), params.push(status);

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(id);
    await connection.query(`UPDATE donations SET ${updates.join(', ')} WHERE id = ?`, params);
    connection.release();

    res.status(200).json({ message: 'Donation updated successfully' });
  } catch (error) {
    console.error('Update donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ngoId = req.user?.userId;

    const connection = await pool.getConnection();
    const [donations]: any = await connection.query('SELECT ngo_id FROM donations WHERE id = ?', [id]);

    if (donations.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donations[0].ngo_id !== ngoId) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized' });
    }

    await connection.query('UPDATE donations SET status = ? WHERE id = ?', ['Cancelled', id]);
    connection.release();

    res.status(200).json({ message: 'Donation cancelled successfully' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNGODonations = async (req: Request, res: Response) => {
  try {
    const ngoId = req.user?.userId;

    if (req.user?.role !== 'NGO') {
      return res.status(403).json({ message: 'Only NGOs can access this' });
    }

    const connection = await pool.getConnection();
    const [donations]: any = await connection.query(
      'SELECT * FROM donations WHERE ngo_id = ? ORDER BY created_at DESC',
      [ngoId]
    );
    connection.release();

    res.status(200).json({ donations });
  } catch (error) {
    console.error('Get NGO donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
