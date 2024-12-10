import { cleanString } from '../string/stringCleaner';

interface TableParseResult {
  headers: string[];
  data: Record<string, any>[];
}

export async function parseTableCSV(content: string): Promise<TableParseResult> {
  if (!content?.trim()) {
    throw new Error('Empty file content');
  }

  // Split into lines and filter out empty ones
  const lines = content.trim().split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('File must have header and data rows');
  }

  // Parse headers and detect delimiter
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : 
                   firstLine.includes(';') ? ';' : ',';

  const headers = firstLine.split(delimiter)
    .map(h => cleanString(h.trim()))
    .filter(Boolean);

  if (headers.length === 0) {
    throw new Error('No valid headers found');
  }

  const data: Record<string, any>[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter)
      .map(v => cleanString(v.trim()));

    // Skip rows with incorrect number of columns
    if (values.length !== headers.length) {
      continue;
    }

    // Create row object
    const row: Record<string, any> = {
      id: `row-${i}`
    };

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  if (data.length === 0) {
    throw new Error('No valid data rows found');
  }

  return {
    headers,
    data
  };
}