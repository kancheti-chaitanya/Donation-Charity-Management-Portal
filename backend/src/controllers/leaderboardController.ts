import pool from '../config/database';
import { Request, Response } from 'express';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();

    // Get top donors by contribution count
    const [leaderboard]: any = await connection.query(
      `SELECT u.id, u.name, COUNT(c.id) as total_contributions, SUM(c.amount) as total_amount
       FROM users u
       LEFT JOIN contributions c ON u.id = c.donor_id
       WHERE u.role = 'Donor'
       GROUP BY u.id, u.name
       ORDER BY total_contributions DESC, total_amount DESC
       LIMIT 100`
    );

    connection.release();

    res.status(200).json({
      leaderboard: leaderboard.map((donor: any, index: number) => ({
        rank: index + 1,
        ...donor,
      })),
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonorStats = async (req: Request, res: Response) => {
  try {
    const donorId = req.user?.userId;

    if (!donorId || req.user?.role !== 'Donor') {
      return res.status(403).json({ message: 'Only donors can access this' });
    }

    const connection = await pool.getConnection();

    const [stats]: any = await connection.query(
      `SELECT COUNT(c.id) as total_contributions, SUM(c.amount) as total_amount
       FROM contributions c
       WHERE c.donor_id = ?`,
      [donorId]
    );

    connection.release();

    res.status(200).json({ stats: stats[0] || { total_contributions: 0, total_amount: 0 } });
  } catch (error) {
    console.error('Get donor stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
