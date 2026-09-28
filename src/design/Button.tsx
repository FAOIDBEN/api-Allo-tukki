import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/format'

type Variant = 'primary' | 'action' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soleil' | 'blanc'
type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-vert-fondation text-white shadow-douce hover:bg-[#004d33] active:bg-[#00442d]',
  action: 'bg-vert-action text-white shadow-douce hover:bg-[#0b6b49]',
  secondary: 'bg-fond-carte text-encre hover:bg-[#dde1f7]',
  outline: 'border-2 border-vert-fondation bg-white text-vert-fondation hover:bg-vert-clair',
  ghost: 'bg-transparent text-vert-fondation hover:bg-vert-clair',
  danger: 'bg-rouge-sos text-white shadow-douce hover:bg-[#b02020]',
  soleil: 'bg-jaune-soleil text-encre shadow-douce hover:bg-[#f5aa10]',
  blanc: 'bg-white text-vert-fondation shadow-douce hover:bg-fond-clair',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-[10px] gap-1.5',
  md: 'h-12 px-4 text-[15px] rounded-bouton gap-2',
  lg: 'h-14 px-5 text-base rounded-bouton gap-2',
  xl: 'min-h-16 px-5 py-3 text-lg rounded-[16px] gap-3',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  block,
  iconLeft,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
