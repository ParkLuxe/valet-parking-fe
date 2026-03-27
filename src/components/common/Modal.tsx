/**
 * Modal Component using Radix UI Dialog
 * Replaces MUI Dialog with Radix UI for consistency
 */

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  className,
  titleClassName,
}) => {
  const { colors } = useTheme();

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" />
        
        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(92vw,56rem)] max-h-[min(88vh,900px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden outline-none',
            'rounded-[24px] shadow-2xl',
            'animate-in zoom-in-95 fade-in duration-200',
            className
          )}
          style={{
            background: colors.dropdownBg,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 20px 60px rgba(15,23,42,0.22)',
          }}
        >

          {/* Header */}
          {title && (
            <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-5" style={{ borderBottom: `1px solid ${colors.divider}` }}>
              <Dialog.Title className={cn('text-xl font-bold', titleClassName)} style={{ color: colors.text, fontFamily: 'Space Grotesk, sans-serif' }}>
                {title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-2xl transition-colors"
                  style={{ background: colors.hoverBg }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" style={{ color: colors.textMuted }} />
                </button>
              </Dialog.Close>
            </div>
          )}
          
          {/* Body */}
          <div className="relative z-10 overflow-y-auto px-6 pb-6 pt-5" style={{ color: colors.text }}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
