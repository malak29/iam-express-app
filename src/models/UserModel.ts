import path from 'path';
import { toRecord } from './User';
import { Result, User, fromRecord } from '../types/UserTypes';
import { readJSON, writeJSON } from '../utility/FileUtility';

const dbPath = path.resolve(__dirname, '../../db/users.json');

export async function getAllUsers(): Promise<Result<User[]>> {
    const result = await readJSON<User[]>(dbPath);
    if (!result.ok) return result;

    const users = result.data.map(fromRecord);
    return { ok: true, data: users };
}

export async function getUserByEmail(email: string): Promise<Result<User>> {
    const all = await getAllUsers();
    if (!all.ok) return all;

    const found = all.data.find((u) => u.email === email);
    if (!found) return { ok: false, error: new Error('User not found') };

    return { ok: true, data: found };
}

export async function getUserById(id: string): Promise<Result<User>> {
    const all = await getAllUsers();
    if (!all.ok) return all;

    const found = all.data.find((u) => u.id === id);
    if (!found) return { ok: false, error: new Error('User not found') };

    return { ok: true, data: found };
}

export async function addUser(user: User): Promise<Result<User>> {
    const all = await getAllUsers();
    if (!all.ok) return all;

    const exists = all.data.find((u) => u.email === user.email);
    if (exists) return { ok: false, error: new Error('User already exists') };

    const updated = [...all.data, user];
    const write = await writeJSON(dbPath, updated.map(toRecord));
    if (!write.ok) return { ok: false, error: write.error };

    return { ok: true, data: user };
}

export async function updateUser(user: User): Promise<Result<User>> {
    const all = await getAllUsers();
    if (!all.ok) return all;

    const index = all.data.findIndex((u) => u.id === user.id);
    if (index === -1) return { ok: false, error: new Error('User not found') };

    const updatedUsers = [...all.data];
    updatedUsers[index] = user;

    const write = await writeJSON(dbPath, updatedUsers.map(toRecord));
    if (!write.ok) return { ok: false, error: write.error };

    return { ok: true, data: user };
}

export async function deleteUserById(id: string): Promise<Result<null>> {
    const all = await getAllUsers();
    if (!all.ok) return { ok: false, error: all.error };

    const filtered = all.data.filter((u) => u.id !== id);
    if (filtered.length === all.data.length) {
        return { ok: false, error: new Error('User not found') };
    }

    const write = await writeJSON(dbPath, filtered.map(toRecord));
    if (!write.ok) return { ok: false, error: write.error };

    return { ok: true, data: null };
}
