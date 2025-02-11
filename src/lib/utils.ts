import { clsx, type ClassValue } from 'clsx'
import { redirect } from 'next/navigation'
import type { User } from 'payload'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function logout(user: User) {
  const res = await fetch(`/api/${user.collection}/logout`, {
    method: 'POST',
  })
  if (res.ok) {
    redirect('/login')
  } else {
    console.error('Failed to logout')
  }
  return res
}
