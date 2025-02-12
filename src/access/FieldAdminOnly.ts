import type { FieldAccess } from 'payload'

export const FieldAdminOnly: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'admins') return true
  return false
}
