import type { Access } from 'payload'

export const FieldClientOrAdmin: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (user.collection === 'admins') {
    return true
  }

  return {
    id: {
      equals: user.id,
    },
  }
}
