import { Database } from 'lucide-react';

interface DatabaseSchemaButtonProps {
  onClick: () => void;
}

export const DatabaseSchemaButton = ({ onClick }: DatabaseSchemaButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 bottom-4 z-[1003] p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      title="View Database Schema"
    >
      <Database className="h-5 w-5 text-gray-700" />
    </button>
  );
};