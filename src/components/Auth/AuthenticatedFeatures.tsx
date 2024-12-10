import { useAuthStore } from '../../store/authStore';
import { GoogleDriveButton } from '../FileUpload/GoogleDriveButton';
import { ImportPopup } from '../ImportPopup/ImportPopup';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const AuthenticatedFeatures = () => {
  const { isAuthenticated } = useAuthStore();
  const [showImport, setShowImport] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={() => setShowImport(true)}
        className="p-1.5 bg-black hover:bg-gray-800 rounded-lg transition-colors"
        title="Import CSV"
      >
        <Plus className="h-4 w-4 text-white" />
      </button>
      {showImport && <ImportPopup onClose={() => setShowImport(false)} />}
    </>
  );
};