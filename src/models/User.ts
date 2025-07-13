
import bcrypt from 'bcrypt';
import { EUserType, EDepartmentType, EUserStatus } from '../types/UserTypes';

// Core user type used throughout the app
export type User = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  userType: EUserType;
  department: EDepartmentType;
  status: EUserStatus;
};

// Input for creating a user (raw password)
export type NewUserInput = {
  id: string;
  name: string;
  email: string;
  password: string; // plain text password
  userType: EUserType;
  department: EDepartmentType;
  status?: EUserStatus; // optional, default to Active
};

// Factory function: creates a user with hashed password
export async function createUser(input: NewUserInput): Promise<User> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(input.password, saltRounds);

  return {
    id: input.id,
    name: input.name,
    email: input.email,
    hashedPassword,
    userType: input.userType,
    department: input.department,
    status: input.status ?? EUserStatus.Active,
  };
}

// Password validator for login or auth flows
export async function validatePassword(user: User, inputPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, user.hashedPassword);
}

// Used to return user object safely to client (without password)
export function toSafeUser(user: User): Omit<User, 'hashedPassword'> {
  const { hashedPassword, ...rest } = user;
  return rest;
}

// Parse raw data (from JSON/file/db) into a valid User object
export function fromRecord(record: any): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    hashedPassword: record.hashedPassword,
    userType: record.userType,
    department: record.department,
    status: record.status ?? EUserStatus.Active, // backward-compatible default
  };
}

// Convert a User to a plain object (for file or DB storage)
export function toRecord(user: User): object {
  return { ...user };
}
