"use client"
import React from 'react';
import styles from './button-new.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';

    const sizeClassMap = {
      default: styles.sizeDefault,
      sm: styles.sizeSm,
      lg: styles.sizeLg,
      icon: styles.sizeIcon,
    };

    const variantClass = styles[variant] || styles.default;
    const sizeClass = sizeClassMap[size] || styles.sizeDefault;

    const buttonClassName = `${styles.button} ${variantClass} ${sizeClass} ${className || ''}`;

    return (
      <Comp
        className={buttonClassName.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
