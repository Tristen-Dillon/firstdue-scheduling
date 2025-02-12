import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface PhoneInputProps {
  value: string
  onChange: (rawValue: string) => void
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(formatPhone(value))

  function formatPhone(value: string) {
    // Format as (XXX) XXX-XXXX
    const numbers = value.replace(/\D/g, '').slice(0, 10)
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digits
    if (rawValue.length <= 10) {
      // Only update if within 10 digit limit
      setDisplayValue(formatPhone(rawValue))
      onChange(rawValue) // Store only digits
    }
  }

  return <Input value={displayValue} onChange={handleChange} />
}
