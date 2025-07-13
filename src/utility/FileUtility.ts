import { promises as fs } from 'fs';
import { Result } from '../types/UserTypes';

export async function readJSON<T>(filePath: string): Promise<Result<T>> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data) as T;
    return { ok: true, data: parsed };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error('Unknown read error') };
  }
}

export async function writeJSON<T>(filePath: string, data: T): Promise<Result<T>> {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf-8');
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error('Unknown write error') };
  }
}
