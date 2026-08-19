'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ButtonVariant = 'primary-green' | 'primary-maroon' | 'outline' | 'ghost' | 'gold';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  'primary-green':
    'bg-green text-white hover:bg-green-dark active:bg-green-dark shadow-sm',
  'primary-maroon':
    'bg-maroon text-white hover:bg-maroon-dark active:bg-maroon-dark shadow-sm',
  outline:
    'border border-foreground/20 text-foreground hover:bg-foreground/5 active:bg-foreground/10',
  ghost: 'text-foreground hover:bg-foreground/5',
  gold: 'bg-gold text-white hover:bg-gold-dark active:bg-gold-dark shadow-sm',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export function Button({
  variant = 'primary-green',
  size = 'md',
  withArrow = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-50 disabled:pointer-events-none group',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
        {withArrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </Link>
    );
  }

  const { href: _, ...buttonProps } = props as ButtonAsButton;

  return (
    <button className={classes} {...buttonProps}>
      {children}
      {withArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}
