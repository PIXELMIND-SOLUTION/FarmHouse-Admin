// utils/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data, filename, headers) => {
  try {
    // Prepare CSV content
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const key = header.toLowerCase().replace(/ /g, '');
        const value = row[key] !== undefined ? row[key] : row[header] || '';
        
        // Handle values that contain commas or special characters
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

export const exportToPDF = (data, filename, headers, title, darkMode) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text(title, 14, 15);
    
    // Add date
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    
    // Prepare table data
    const tableHeaders = headers;
    const tableData = data.map(row => {
      return headers.map(header => {
        const key = header.toLowerCase().replace(/ /g, '');
        return row[key] !== undefined ? String(row[key]) : String(row[header] || '');
      });
    });
    
    // Add table
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: darkMode ? [255, 255, 255] : [0, 0, 0],
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: darkMode ? [50, 50, 50] : [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 }
      }
    });
    
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};

export const printReport = (data, headers, title) => {
  try {
    const printWindow = window.open('', '_blank');
    const styles = `
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
          padding: 30px; 
          margin: 0;
          background: #f9fafb;
        }
        .report-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        h1 { 
          color: #4f46e5; 
          font-size: 28px;
          margin: 0 0 10px 0;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 15px;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 25px;
          color: #6b7280;
        }
        .date { 
          color: #6b7280; 
          font-size: 14px;
          background: #f3f4f6;
          padding: 6px 12px;
          border-radius: 6px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
          font-size: 13px;
        }
        th { 
          background: #4f46e5; 
          color: white; 
          padding: 12px; 
          text-align: left;
          font-weight: 600;
          font-size: 13px;
        }
        td { 
          padding: 10px 12px; 
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }
        tr:nth-child(even) { 
          background: #f9fafb; 
        }
        tr:hover {
          background: #f3f4f6;
        }
        .footer { 
          margin-top: 30px; 
          text-align: center; 
          color: #9ca3af; 
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .badge {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
      </style>
    `;
    
    const tableRows = data.map(row => {
      return '<tr>' + headers.map(header => {
        const key = header.toLowerCase().replace(/ /g, '');
        let value = row[key] !== undefined ? row[key] : row[header] || '';
        
        // Format currency if it looks like a number
        if (typeof value === 'number' || !isNaN(parseFloat(value))) {
          value = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
          }).format(parseFloat(value));
        }
        
        return `<td>${value}</td>`;
      }).join('') + '</tr>';
    }).join('');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          ${styles}
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <h1>${title}</h1>
              <div class="date">${new Date().toLocaleString()}</div>
            </div>
            <table>
              <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <div class="footer">
              Generated by FarmHouse Management System • Confidential
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } catch (error) {
    console.error('Error printing report:', error);
  }
};