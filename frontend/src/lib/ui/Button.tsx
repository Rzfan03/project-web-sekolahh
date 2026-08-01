import { cn } from '../utils'
import type { IconType } from 'react-icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'outline-edit' | 'outline-delete'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconType
  iconPosition?: 'left' | 'right'
  loading?: boolean
}

export function Button({
  className, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', loading, children, ref, ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
        {
          'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow-md focus-visible:ring-orange-500': variant === 'primary',
          'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-400': variant === 'secondary',
          'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md focus-visible:ring-red-500': variant === 'danger',
          'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400': variant === 'ghost',
          'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md focus-visible:ring-emerald-500': variant === 'success',
          'border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 focus-visible:ring-blue-400': variant === 'outline-edit',
          'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400': variant === 'outline-delete',
        },
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-4 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={cn({ 'size-3.5': size === 'sm', 'size-4': size === 'md', 'size-5': size === 'lg' }, loading && 'animate-spin')} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={cn({ 'size-3.5': size === 'sm', 'size-4': size === 'md', 'size-5': size === 'lg' }, loading && 'animate-spin')} />}
    </button>
  )
}
