import type { FieldAccess } from 'payload'

export const FieldUserAuthenticated: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  return true
}
