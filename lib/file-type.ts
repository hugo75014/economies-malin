// File type detection — accept any file, normalize MIME type from extension if needed
// Supports: images, PDFs, CSVs, text files, Excel, anything really

const EXT_TO_MIME: Record<string, string> = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  // Documents
  pdf: 'application/pdf',
  // Text
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  md: 'text/markdown',
  // Spreadsheets
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  // Office docs
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Data
  qif: 'application/x-qif',
  ofx: 'application/x-ofx',
};

export function normalizeFile(file: File): { mimeType: string; fileName: string; ext: string } {
  let mimeType = file.type;
  let ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  // If browser didn't detect MIME, infer from extension
  if (!mimeType || mimeType === 'application/octet-stream') {
    if (ext && EXT_TO_MIME[ext]) {
      mimeType = EXT_TO_MIME[ext];
    } else {
      mimeType = 'application/octet-stream';
    }
  }

  return { mimeType, fileName: file.name, ext };
}

export type FileCategory = 'image' | 'pdf' | 'text' | 'spreadsheet' | 'office' | 'data' | 'unknown';

export function categorize(mimeType: string, ext: string): FileCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('text/') || ['json', 'xml', 'csv', 'md', 'txt'].includes(ext)) return 'text';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || ['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return 'spreadsheet';
  if (mimeType.includes('word') || mimeType.includes('office') || ['doc', 'docx', 'odt'].includes(ext)) return 'office';
  if (['qif', 'ofx'].includes(ext)) return 'data';
  return 'unknown';
}

export function isTextReadable(mimeType: string, ext: string): boolean {
  if (mimeType.startsWith('text/')) return true;
  if (['json', 'xml', 'csv', 'md', 'txt', 'qif', 'ofx'].includes(ext)) return true;
  return false;
}
