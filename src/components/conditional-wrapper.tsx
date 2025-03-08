import type { JSX } from 'react'

interface ConditionalWrapperProps {
  condition: boolean
  wrapper: (children: React.ReactNode) => JSX.Element
  children: React.ReactNode
  elseWrapper?: (children: React.ReactNode) => JSX.Element
}

export default function ConditionalWrapper({
  condition,
  wrapper,
  children,
  elseWrapper,
}: ConditionalWrapperProps) {
  return condition ? wrapper(children) : elseWrapper ? elseWrapper(children) : children
}
