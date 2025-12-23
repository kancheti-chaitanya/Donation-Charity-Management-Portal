import { Request, Response, NextFunction } from 'express';

// In-memory database for demonstration/testing without MySQL
const inMemoryDB = {
  users: [] as any[],
  donations: [] as any[],
  contributions: [] as any[],
  pickups: [] as any[],
};

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'Donor' | 'NGO' | 'Admin';
  contact_info: string;
  created_at: Date;
}

let userIdCounter = 1;

// Export functions to use with in-memory database
export const getUsers = () => inMemoryDB.users;
export const getDonations = () => inMemoryDB.donations;
export const getContributions = () => inMemoryDB.contributions;
export const getPickups = () => inMemoryDB.pickups;

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser = {
    id: userIdCounter++,
    ...user,
  };
  inMemoryDB.users.push(newUser);
  return newUser;
};

export const getUserByEmail = (email: string) => {
  return inMemoryDB.users.find((u) => u.email === email);
};

export const getUserById = (id: number) => {
  return inMemoryDB.users.find((u) => u.id === id);
};

export const updateUser = (id: number, updates: Partial<User>) => {
  const user = getUserById(id);
  if (user) {
    Object.assign(user, updates);
  }
  return user;
};

// Clear database (for testing)
export const clearDatabase = () => {
  inMemoryDB.users = [];
  inMemoryDB.donations = [];
  inMemoryDB.contributions = [];
  inMemoryDB.pickups = [];
  userIdCounter = 1;
};
