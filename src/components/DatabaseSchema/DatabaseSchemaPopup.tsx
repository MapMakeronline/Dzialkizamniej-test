import { X } from 'lucide-react';

interface DatabaseSchemaPopupProps {
  onClose: () => void;
}

export const DatabaseSchemaPopup = ({ onClose }: DatabaseSchemaPopupProps) => {
  const tables = [
    { 
      name: 'Layers',
      schema: {
        id: 'string',
        name: 'string',
        type: 'string',
        visible: 'boolean',
        data: 'object',
        attributes: 'array',
        orderedColumns: 'array',
        style: 'object',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      }
    },
    {
      name: 'Users',
      schema: {
        id: 'string',
        email: 'string',
        name: 'string',
        picture: 'string',
        googleId: 'string',
        createdAt: 'timestamp'
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Database Schema</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto">
          {tables.map(table => (
            <div key={table.name} className="space-y-2">
              <h3 className="text-base font-medium text-gray-900">{table.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(table.schema).map(([key, value]) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{key}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};