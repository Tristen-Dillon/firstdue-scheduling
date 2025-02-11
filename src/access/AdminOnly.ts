import type { Access } from 'payload'

export const AdminOnly: Access = ({ req: { user } }) => {
  if (user?.collection !== 'admins') {
    return false
  }

  return true
}
