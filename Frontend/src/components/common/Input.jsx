import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Input({ label, type = 'text', id, className = '', error, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        id={id}
        className={twMerge(`px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`, className)}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}