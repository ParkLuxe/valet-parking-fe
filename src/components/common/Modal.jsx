/**
 * Modal Component using Radix UI Dialog
 * Replaces MUI Dialog with Radix UI for consistency
 */

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Modal = ({
  open,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        
        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'w-full max-w-lg max-h-[85vh] overflow-y-auto',
            'bg-gradient-to-br from-[#1a1a2e] to-[#16162a]',
            'border border-white/10 rounded-2xl shadow-2xl',
            'p-6 animate-in zoom-in-95 fade-in duration-200',
            className
          )}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold text-white">
                {title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </Dialog.Close>
            </div>
          )}
          
          {/* Body */}
          <div className="text-white">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
