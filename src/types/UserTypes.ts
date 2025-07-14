// User roles in the system
export enum EUserType {
    GENERAL = 'GENERAL',
    DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
    ADMIN = 'ADMIN',
  }
  
  // Organizational departments
  export enum EDepartmentType {
    DEPARTMENT1 = 'DEPARTMENT1',
    DEPARTMENT2 = 'DEPARTMENT2',
    DEPARTMENT3 = 'DEPARTMENT3',
    DEPARTMENT4 = 'DEPARTMENT4'
  }
  
  // Account status
  export enum EUserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
  }
  
export type IUser = {
    id: string
    name: string
    email: string
    hashedPassword: string
    userType: EUserType
    department: EDepartmentType
    status: EUserStatus
}

// Input for creating a user (raw password)
export type INewUserInput = {
    id: string
    name: string
    email: string
    password: string // plain text password
    userType: EUserType
    department: EDepartmentType
    status: EUserStatus
}

export enum EUserActions {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CHANGE_STATUS = 'CHANGE_STATUS',
}