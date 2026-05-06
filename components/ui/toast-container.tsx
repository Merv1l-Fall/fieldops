"use client";

import { useContext } from "react";
import { ToastContext } from "@/lib/context/toast-context";
import { X } from "lucide-react";

export function ToastContainer() {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300 flex items-start gap-3 ${
            toast.variant === "destructive"
              ? "bg-red-600 text-white border-red-700"
              : "bg-green-600 text-white border-green-700"
          }`}
        >
          <div className="flex-1">
            {toast.title && (
              <h3 className="font-semibold text-sm">{toast.title}</h3>
            )}
            {toast.description && (
              <p className="text-sm opacity-90 mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 hover:opacity-75 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
