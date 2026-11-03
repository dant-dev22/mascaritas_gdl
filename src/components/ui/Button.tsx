import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from '@/i18n/navigation';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { cn, NOOP } from '@/__lib__/utils';
import type { ButtonSize, ButtonVariant } from '@/__types__';

export const BUTTON_ICON_PROPS = {
  width: 18,
  height: 18,
  strokeWidth: 2,
} as const;

export const BUTTON_LARGE_ICON_PROPS = {
  width: 20,
  height: 20,
  strokeWidth: 2,
} as const;

const buttonVariants = cva(
  [
    'group',
    'relative inline-flex items-center justify-center gap-2',
    'select-none whitespace-nowrap',
    'touch-target',
    'font-semibold tracking-tight',
    'rounded-2xl',
    'outline-none',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none',
    'active:scale-[0.96]',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
    'cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-accent-green',
          'text-white',
          'shadow-[0_10px_40px_-12px_rgba(0,168,107,0.55)]',
          'hover:bg-accent-green-hover',
          'active:bg-accent-green-pressed',
          'focus-visible:shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
        ].join(' '),
        secondary: [
          'bg-transparent',
          'text-white',
          'border',
          'border-border-emphasis',
          'hover:bg-surface-hover',
          'active:bg-surface-hover',
          'focus-visible:shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
        ].join(' '),
        ghost: [
          'bg-transparent',
          'text-text-muted',
          'hover:text-white hover:bg-surface',
          'active:bg-surface-hover',
          'focus-visible:shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
        ].join(' '),
      } satisfies Record<ButtonVariant, string>,
      size: {
        sm: 'h-11 px-4 text-sm',
        md: 'h-12 px-6 text-[15px]',
        lg: 'h-[60px] px-7 text-[17px]',
      } satisfies Record<ButtonSize, string>,
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type BaseProps = ButtonVariantProps & {
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    readonly as?: 'button';
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    readonly as: 'link';
    readonly href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  props,
  ref,
) {
  const {
    variant,
    size,
    fullWidth,
    leftIcon,
    rightIcon,
    children,
    className,
  } = props;

  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

  const content = (
    <>
      {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
      {children ? <span>{children}</span> : null}
      {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
    </>
  );

  if (props.as === 'link') {
    const {
      as,
      href,
      variant: _v,
      size: _s,
      fullWidth: _fw,
      leftIcon: _li,
      rightIcon: _ri,
      children: _c,
      className: _cn,
      ...rest
    } = props as ButtonAsLink;
    void as;
    void _v; void _s; void _fw; void _li; void _ri; void _c; void _cn;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  const {
    as: _as,
    variant: _v,
    size: _s,
    fullWidth: _fw,
    leftIcon: _li,
    rightIcon: _ri,
    children: _c,
    className: _cn,
    onClick,
    ...rest
  } = props as ButtonAsButton;
  void _as; void _v; void _s; void _fw; void _li; void _ri; void _c; void _cn;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      onClick={onClick ?? NOOP}
      {...rest}
    >
      {content}
    </button>
  );
});
