// User roles in the system
export enum EUserType {
    General = 'General',
    DepartmentHead = 'DepartmentHead',
    Admin = 'Admin',
  }
  
  // Organizational departments
  export enum EDepartmentType {
    General = 'General',
    HR = 'HR',
    Sales = 'Sales',
    IT = 'IT',
    Marketing = 'Marketing',
    Finance = 'Finance',
  }
  
  // Account status
  export enum EUserStatus {
    Active = 'active',
    Inactive = 'inactive',
  }
  
  // Generic result wrapper for safe error handling
  export type Result<T> =
    | { ok: true; data: T }
    | { ok: false; error: Error };
  