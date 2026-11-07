import { unzipSync, strFromU8 } from 'fflate';
import { normalizeMobileNumber } from './helpers';

export interface WorkbookClientRow {
  rowNumber: number;
  companyName: string;
  mobileNumber: string;
  businessCategory: string;
  websiteUrl: string;
  sourceNote: string;
}

export interface RejectedWorkbookRow {
  rowNumber: number;
  companyName: string;
  mobileNumber: string;
  reason: string;
}

export interface WorkbookImportPreview {
  rows: WorkbookClientRow[];
  rejected: RejectedWorkbookRow[];
}

function categoryName(value: string): string | undefined {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (normalized.includes('aluminium fabrication') || normalized.includes('aluminum fabrication') || normalized.includes('aliminuum fabrication')) return 'Aluminium Fabrication';
  if (normalized === 'waterproofing') return 'Waterproofing';
  if (normalized === 'wedding stage work') return 'Wedding Stage Work';
  return undefined;
}

function columnIndex(reference: string): number {
  const letters = reference.match(/^[A-Z]+/)?.[0] || 'A';
  return [...letters].reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

export async function parseClientWorkbook(file: File): Promise<WorkbookImportPreview> {
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const xml = (path: string) => {
    const bytes = archive[path];
    if (!bytes) throw new Error(`Workbook is missing ${path}.`);
    return new DOMParser().parseFromString(strFromU8(bytes), 'application/xml');
  };

  const workbook = xml('xl/workbook.xml');
  const relationships = xml('xl/_rels/workbook.xml.rels');
  const sheet = workbook.getElementsByTagName('sheet')[0];
  if (!sheet) throw new Error('The workbook does not contain a worksheet.');
  const relationId = sheet.getAttribute('r:id');
  const relation = [...relationships.getElementsByTagName('Relationship')].find(item => item.getAttribute('Id') === relationId);
  const target = relation?.getAttribute('Target');
  if (!target) throw new Error('Could not locate the first worksheet.');
  const sheetPath = target.startsWith('/') ? target.slice(1) : `xl/${target.replace(/^\.\//, '')}`;
  const worksheet = xml(sheetPath);
  const sharedStrings = archive['xl/sharedStrings.xml']
    ? [...xml('xl/sharedStrings.xml').getElementsByTagName('si')].map(item => item.textContent || '')
    : [];

  const rows: string[][] = [];
  for (const row of [...worksheet.getElementsByTagName('row')]) {
    const values: string[] = [];
    for (const cell of [...row.getElementsByTagName('c')]) {
      const index = columnIndex(cell.getAttribute('r') || 'A1');
      const value = cell.getElementsByTagName('v')[0]?.textContent || '';
      const type = cell.getAttribute('t');
      values[index] = type === 's' ? (sharedStrings[Number(value)] || '')
        : type === 'inlineStr' ? (cell.getElementsByTagName('is')[0]?.textContent || '')
          : value;
    }
    rows.push(values);
  }

  const result: WorkbookImportPreview = { rows: [], rejected: [] };
  const seenNumbers = new Set<string>();
  let currentCategory = '';
  rows.forEach((row, index) => {
    const name = (row[0] || '').trim();
    if (!name) return;
    const heading = categoryName(name);
    if (heading && !(row[1] || '').trim() && !(row[2] || '').trim()) {
      currentCategory = heading;
      return;
    }
    if (/^name$/i.test(name) || !currentCategory) return;

    const mobileNumber = (row[1] || '').trim();
    const normalized = normalizeMobileNumber(mobileNumber);
    const reject = (reason: string) => result.rejected.push({ rowNumber: index + 1, companyName: name, mobileNumber, reason });
    if (!normalized || normalized.length < 7 || normalized.length > 15) {
      reject('Missing or invalid phone number');
      return;
    }
    if (seenNumbers.has(normalized)) {
      reject('Duplicate phone number in this workbook');
      return;
    }
    seenNumbers.add(normalized);
    result.rows.push({
      rowNumber: index + 1,
      companyName: name,
      mobileNumber,
      businessCategory: currentCategory,
      websiteUrl: (row[2] || '').trim(),
      sourceNote: (row[3] || '').trim(),
    });
  });

  if (!result.rows.length && !result.rejected.length) throw new Error('No client rows found. Expected category headings and NAME / NUMBER columns.');
  return result;
}
