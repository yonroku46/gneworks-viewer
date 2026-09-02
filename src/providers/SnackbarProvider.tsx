'use client';

import React, { forwardRef } from 'react';
import { SnackbarProvider as NotistackProvider, CustomContentProps, useSnackbar } from 'notistack';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const CustomSnackbar = forwardRef<HTMLDivElement, CustomContentProps>((props, ref) => {
  const { id, message, variant } = props;
  const { closeSnackbar } = useSnackbar();

  const getIcon = () => {
    switch (variant) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'info': return <Info size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div ref={ref} className={`custom-snackbar-content variant-${variant}`}>
      <div className="snackbar-icon">{getIcon()}</div>
      <div className="snackbar-message">{message}</div>
      <button className="snackbar-close" onClick={() => closeSnackbar(id)}>
        <X size={16} />
      </button>
    </div>
  );
});

CustomSnackbar.displayName = 'CustomSnackbar';

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={3000}
      preventDuplicate
      Components={{
        default: CustomSnackbar,
        success: CustomSnackbar,
        error: CustomSnackbar,
        warning: CustomSnackbar,
        info: CustomSnackbar,
      }}
    >
      {children}
    </NotistackProvider>
  );
}
