import type { Access } from 'payload'

export const UserAuthenticated: Access = ({ req: { user } }) => {
  return !!user
}
