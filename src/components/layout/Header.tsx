'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { BRAND, HEADER_LINKS } from '@/__data__/navLinks';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { cn } from '@/__lib__/utils';
import { useCartContext } from '@/__hooks__/useCartContext';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';

interface HeaderProps {
  readonly className?: string;
}

export function Header({ className }: HeaderProps) {
  const { state } = useCartContext();
  const cartCount = state.count;

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'bg-canvas/80 backdrop-blur',
        'border-b border-border-subtle',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${BRAND.name} — Inicio`}
          className="flex items-center gap-2 group touch-target"
        >
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface border border-border-subtle group-hover:border-border-emphasis transition-colors">
            <span className="font-display text-2xl text-accent-green leading-none">
              {BRAND.shortCode}
            </span>
          </span>
          <span className="hidden sm:inline font-display text-xl md:text-2xl tracking-wide leading-none text-white group-hover:text-accent-green-hover transition-colors">
            {BRAND.name}
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted"
        >
          {HEADER_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="touch-target inline-flex items-center hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          as="link"
          href={CATALOG_PATH}
          variant="primary"
          size="sm"
          leftIcon={<ShoppingCart {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          aria-label={
            cartCount > 0
              ? `Ir al catálogo, ${cartCount} productos en el carrito`
              : 'Ir al catálogo'
          }
        >
          <span className="hidden sm:inline">Ver catálogo</span>
          <span className="sm:hidden">Catálogo</span>
          {cartCount > 0 ? (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/15 text-[11px] font-bold text-white"
            >
              {cartCount}
            </span>
          ) : null}
        </Button>
      </div>
    </header>
  );
}
