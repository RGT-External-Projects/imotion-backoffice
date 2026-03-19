/**
 * Export utility functions for downloading data in various formats
 */

/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param headers - Array of header names
 * @param filename - Name of the file (without extension)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  headers: string[],
  filename: string
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create CSV content
  const csvRows: string[] = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach(item => {
    const values = Object.values(item).map(value => {
      // Handle different types of values
      if (value === null || value === undefined) {
        return '""';
      }
      
      // Convert arrays to comma-separated string
      if (Array.isArray(value)) {
        return `"${value.join(', ')}"`;
      }
      
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    });
    
    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\n');

  // Create and trigger download
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export data to JSON format
 * @param data - Data to export (can be object or array)
 * @param filename - Name of the file (without extension)
 */
export function exportToJSON<T>(data: T, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json;charset=utf-8;');
}

/**
 * Helper function to trigger file download
 * @param content - File content
 * @param filename - Full filename with extension
 * @param mimeType - MIME type of the file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Get current date in YYYY-MM-DD format for filename
 */
export function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}
