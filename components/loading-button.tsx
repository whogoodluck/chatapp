import { Loader2Icon } from 'lucide-react'
import { ReactNode } from 'react'

import { Button, ButtonProps } from '@/components/ui/button'

type LoadingButtonProps = {
  text?: string | ReactNode
  loading?: boolean
  disabled?: boolean
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
}

export default function LoadingButton({
  text = 'Submit',
  loading = false,
  disabled = false,
  variant = 'default',
  size = 'default',
  type = 'submit',
  className = '',
  onClick = () => {},
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading || disabled}
      type={type}
      className={className}
      onClick={onClick}
    >
      {loading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : text}
    </Button>
  )
}
