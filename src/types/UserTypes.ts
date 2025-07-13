export enum EUserType {
    General = 'General',
    DepartmentHead = 'DepartmentHead',
    Admin = 'Admin'
}

export enum EDepartmentType {
    General = 'General',
    HR = 'HR',
    Sales = 'Sales',
    IT = 'IT',
    Marketing = 'Marketing',
    Finance = 'Finance',
}

export interface IUserRecord {
    id: string
    name: string
    email: string
    hashedPassword: string
    userType: EUserType
    department: EDepartmentType
}
export function fromRecord(record: any): User {
    return {
        id: record.id,
        name: record.name,
        email: record.email,
        hashedPassword: record.hashedPassword,
        userType: record.userType,
        department: record.department,
    }
}

export type Result<T> =
    | { ok: true; data: T }
    | { ok: false; error: Error }

export interface User {
    id: string
    name: string
    email: string
    hashedPassword: string
    userType: EUserType
    department: EDepartmentType
}

export interface CreateUserInput {
    id: string
    name: string
    email: string
    password: string
    userType: EUserType
    department: EDepartmentType
  }
  