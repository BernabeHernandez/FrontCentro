import React, { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WifiOff, Wifi } from 'lucide-react';

const NetworkStatusToast = () => {
  const offlineToastId = useRef(null);

  useEffect(() => {
    const handleOnline = () => {
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }

      toast.success(
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Conexión restaurada</span>
        </div>,
        {
          toastId: 'online-toast',
          autoClose: 4000,
          icon: false,
          position: 'top-center',
          style: {
            top: '70px',
            padding: '8px 16px',
            borderRadius: '8px',
            minHeight: 'auto',
            width: 'fit-content',
            maxWidth: 'none',
          },
        }
      );
    };

    const handleOffline = () => {
      offlineToastId.current = toast.error(
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">Sin conexión - Offline</span>
        </div>,
        {
          toastId: 'offline-toast',
          autoClose: false,
          closeButton: false,
          icon: false,
          position: 'top-center',
          style: {
            top: '70px',
            padding: '8px 16px',
            borderRadius: '8px',
            minHeight: 'auto',
            width: 'fit-content',
            maxWidth: 'none',
          },
        }
      );
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ToastContainer
      position="top-center"
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      theme="colored"
      limit={1}
      style={{
        width: 'auto',
        maxWidth: 'none',
        zIndex: 999,
        pointerEvents: 'none',
      }}
      toastStyle={{
        pointerEvents: 'auto',
      }}
    />
  );
};

export default NetworkStatusToast;