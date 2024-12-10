import { Table } from 'lucide-react';

interface CSVPreviewProps {
  headers: string[];
  data: string[][];
  onSelectGeometryColumn: (column: string) => void;
}

export const CSVPreview = ({ headers, data, onSelectGeometryColumn }: CSVPreviewProps) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Data Preview</h3>
        <p className="text-sm text-gray-600">
          Select a column that will be used as geometry data
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => onSelectGeometryColumn(header)}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <span>{header}</span>
                    <Table className="h-4 w-4" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 5).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 5 && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          Showing first 5 rows of {data.length} total rows
        </div>
      )}
    </div>
  );
};