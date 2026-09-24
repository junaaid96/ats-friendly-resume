import Link from 'next/link';
import { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import Icon, { IconName, Spinner } from '@/components/ui/Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-black shadow-sm',
  secondary: 'bg-surface text-ink border border-line-strong hover:border-ink/40 hover:bg-paper',
  ghost: 'text-ink-2 hover:bg-paper-2 hover:text-ink',
  danger: 'text-brand hover:bg-brand-soft',
  ai: 'bg-brand text-white hover:bg-brand-hover shadow-sm',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-[10px]',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-xl',
};

export function buttonClass(variant: Variant = 'secondary', size: Size = 'md', extra = '') {
  return `inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
}

export function Button({
  variant,
  size,
  icon,
  iconRight,
  loading,
  className = '',
  children,
  type = 'button',
  ...props
}: Common & { loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const iconSize = size === 'sm' ? 15 : 17;
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props}>
      {loading ? <Spinner size={iconSize} /> : icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  className = '',
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  const iconSize = size === 'sm' ? 15 : 17;
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </Link>
  );
}
