import { read, utils } from 'xlsx';

interface SpreadsheetParseResult {
  attributes: Record<string, any>[];
  name?: string;
}

export async function parseSpreadsheet(content: ArrayBuffer): Promise<SpreadsheetParseResult> {
  const workbook = read(content, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  
  if (!firstSheet) {
    throw new Error('No sheets found in the workbook');
  }

  const data = utils.sheet_to_json(firstSheet, { header: 1 });
  if (data.length < 2) {
    throw new Error('Sheet must have headers and at least one data row');
  }

  const headers = data[0] as string[];
  const rows = data.slice(1) as any[][];

  const attributes = rows.map((row, index) => {
    const obj: Record<string, any> = { id: `row-${index + 1}` };
    headers.forEach((header, i) => {
      if (row[i] !== undefined) {
        obj[header] = row[i];
      }
    });
    return obj;
  });

  return {
    attributes,
    name: workbook.SheetNames[0]
  };
}