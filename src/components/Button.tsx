import { createElement, type ComponentPropsWithRef } from 'react';

export function Button({ className = '', type = 'button', ...props }: ComponentPropsWithRef<'button'>) {
  return createElement('button', { type, className: `button ${className}`, ...props });
}
