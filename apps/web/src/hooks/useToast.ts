import toast from 'react-hot-toast';

/**
 * Custom hook for toast notifications
 */
export const useToast = () => {
  const success = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-center',
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'bottom-center',
      style: {
        background: '#DC2626',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#DC2626',
      },
    });
  };

  const info = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'bottom-center',
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      position: 'bottom-center',
      style: {
        background: '#6B7280',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
      },
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'bottom-center',
        style: {
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
        },
      }
    );
  };

  return {
    success,
    error,
    info,
    loading,
    dismiss,
    promise,
  };
};
