/**
 * Type declarations for existing JavaScript components
 * These allow TypeScript files to import and use JS components
 */

declare module '../components/common/Button' {
  import { ReactNode } from 'react';
  
  interface ButtonProps {
    children?: any;
    variant?: string;
    size?: string;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    startIcon?: any;
    endIcon?: any;
    onClick?: any;
    type?: string;
    className?: string;
    [key: string]: any;
  }
  
  const Button: React.FC<ButtonProps>;
  export default Button;
}

declare module '../components/common/Card' {
  import { ReactNode } from 'react';
  
  interface CardProps {
    children?: any;
    title?: any;
    subtitle?: any;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    gradient?: boolean;
    actions?: any;
    headerAction?: any;
    [key: string]: any;
  }
  
  const Card: React.FC<CardProps>;
  export default Card;
}

declare module '../components/common/LoadingSpinner' {
  interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }
  
  const LoadingSpinner: React.FC<LoadingSpinnerProps>;
  export default LoadingSpinner;
}

declare module '../components/common/Input' {
  interface InputProps {
    type?: string;
    name?: string;
    label?: any;
    value?: string | number;
    placeholder?: string;
    onChange?: any;
    onBlur?: any;
    disabled?: boolean;
    error?: boolean | string;
    helperText?: string;
    required?: boolean;
    className?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  const Input: React.FC<InputProps>;
  export default Input;
}

declare module '../components/payment/RazorpayButton' {
  interface RazorpayButtonProps {
    invoice?: any;
    invoiceId?: string;
    amount?: number;
    invoiceNumber?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    buttonText?: string;
    buttonVariant?: string;
    disabled?: boolean;
  }
  
  const RazorpayButton: React.FC<RazorpayButtonProps>;
  export default RazorpayButton;
}
