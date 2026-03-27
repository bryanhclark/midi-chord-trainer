import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const readJSON = async (path: string) => {
  try {
    const res = await fetch(path)
    return res.json()
  } catch (error) {
    console.error('Error loading JSON at path: ', path, '\nError: ', error)
  }
}
