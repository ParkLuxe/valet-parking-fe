/**
 * ExportButton Component
 * Handles data export to CSV, PDF, and Excel formats
 */

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import Button from './Button';

const ExportButton = ({
  data = [],
  filename = 'export',
  columns = [],
  format = 'csv',
  variant = 'secondary',
  size = 'medium',
}) => {
  const [exporting, setExporting] = useState(false);

  // Convert data to CSV
  const convertToCSV = (data, columns) => {
    if (!data || data.length === 0) return '';

    // Get headers
    const headers = columns.map((col) => col.header || col.accessor);
    const csvHeaders = headers.join(',');

    // Get rows
    const csvRows = data.map((row) => {
      return columns
        .map((col) => {
          let value = row[col.accessor];
          
          // Handle null/undefined
          if (value === null || value === undefined) {
            value = '';
          }
          
          // Convert to string and escape quotes
          value = String(value).replace(/"/g, '""');
          
          // Wrap in quotes if contains comma, newline, or quote
          if (value.includes(',') || value.includes('\n') || value.includes('"')) {
            value = `"${value}"`;
          }
          
          return value;
        })
        .join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  };

  // Download CSV
  const downloadCSV = () => {
    setExporting(true);
    try {
      const csv = convertToCSV(data, columns);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  // Download JSON
  const downloadJSON = () => {
    setExporting(true);
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting JSON:', error);
    } finally {
      setExporting(false);
    }
  };

  // Download Excel (as CSV with .xlsx extension - for basic compatibility)
  const downloadExcel = () => {
    setExporting(true);
    try {
      const csv = convertToCSV(data, columns);
      const blob = new Blob([csv], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    } finally {
      setExporting(false);
    }
  };

  // Download PDF (basic text-based PDF)
  const downloadPDF = () => {
    setExporting(true);
    try {
      // For a basic PDF export, we'll convert to HTML table and let browser print
      const headers = columns.map((col) => col.header || col.accessor);
      const rows = data.map((row) =>
        columns.map((col) => row[col.accessor] || '')
      );

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print();
        };
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExport = () => {
    switch (format) {
      case 'csv':
        downloadCSV();
        break;
      case 'json':
        downloadJSON();
        break;
      case 'excel':
        downloadExcel();
        break;
      case 'pdf':
        downloadPDF();
        break;
      default:
        downloadCSV();
    }
  };

  const getIcon = () => {
    switch (format) {
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (format) {
      case 'csv':
        return 'Export CSV';
      case 'json':
        return 'Export JSON';
      case 'excel':
        return 'Export Excel';
      case 'pdf':
        return 'Export PDF';
      default:
        return 'Export';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      loading={exporting}
      disabled={!data || data.length === 0}
      startIcon={getIcon()}
    >
      {getLabel()}
    </Button>
  );
};

export default ExportButton;
