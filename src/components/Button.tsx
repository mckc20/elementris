import { createElement, type ComponentPropsWithoutRef } from 'react';

export function Button({ className = '', type = 'button', ...props }: ComponentPropsWithoutRef<'button'>) {
  return createElement('button', { type, className: `button ${className}`, ...props });
}
