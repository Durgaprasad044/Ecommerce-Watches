import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

export default function EmptyState({ title = 'No items found', description = 'There are no items to display right now.', icon = <FiInbox className="w-12 h-12 text-gray-400" />, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-gray-300 bg-gray-50 min-h-[300px]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
}