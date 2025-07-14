import { promises as fs } from 'fs'

const FILENAME = "FileUtility.ts"

export async function readJSON<T>(filePath: string): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data) as T
  } catch (error: any) {
    throw new Error(`${FILENAME}: Failed to read or parse JSON from ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, 'utf-8')
  } catch (error: any) {
    throw new Error(`${FILENAME}: Failed to write JSON to ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}
