import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in"
      style={{
        background: type === 'success' ? '#1a2e1a' : '#2e1a1a',
        border: `1px solid ${type === 'success' ? '#2d5a2d' : '#5a2d2d'}`,
        color: type === 'success' ? '#6fcf6f' : '#f87171',
        minWidth: '280px',
      }}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
    </div>
  );
}

interface ToastItem { id: number; message: string; type: ToastType; }

let toastCallback: ((msg: string, type: ToastType) => void) | null = null;
let toastCounter = 0; // module-scope da se ID-jevi ne resetuju na svaki render

export function showToast(message: string, type: ToastType = 'success') {
  toastCallback?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  toastCallback = (message, type) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
