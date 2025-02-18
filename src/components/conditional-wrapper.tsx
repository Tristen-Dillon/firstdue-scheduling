import type { JSX } from 'react'

interface ConditionalWrapperProps {
  condition: boolean
  wrapper: (children: React.ReactNode) => JSX.Element
  children: React.ReactNode
}

export default function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) {
  return condition ? wrapper(children) : children
}
