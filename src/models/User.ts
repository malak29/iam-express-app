import bcrypt from 'bcrypt';
import { EDepartmentType, EUserType, User } from '../types/UserTypes';

export async function createUser(
    id: string,
    name: string,
    email: string,
    plainPassword: string,
    userType: EUserType = EUserType.General,
    department: EDepartmentType = EDepartmentType.General
): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    return {
        id,
        name,
        email,
        hashedPassword,
        userType,
        department,
    };
}

export function getId(user: User): string {
    return user.id;
}

export function getName(user: User): string {
    return user.name;
}

export function setName(user: User, name: string): User {
    return { ...user, name };
}

export function getEmail(user: User): string {
    return user.email;
}

export function setEmail(user: User, email: string): User {
    return { ...user, email };
}

export async function validatePassword(user: User, plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, user.hashedPassword);
}

export function getUserType(user: User): EUserType {
    return user.userType;
}

export function setUserType(user: User, userType: EUserType): User {
    return { ...user, userType };
}

export function getDepartment(user: User): EDepartmentType {
    return user.department;
}

export function setDepartment(user: User, department: EDepartmentType): User {
    return { ...user, department };
}

export function toJSONNoPass(user: User): object {
    const { hashedPassword, ...rest } = user;
    return rest;
}

export function toRecord(user: User): object {
    return { ...user };
}
