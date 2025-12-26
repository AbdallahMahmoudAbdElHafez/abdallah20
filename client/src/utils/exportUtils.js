import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Common Excel export utility for reports
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Visible columns from MaterialReactTable (getVisibleLeafColumns)
 * @param {string} fileName - Name of the file to save
 */
export const exportToExcel = async (data, columns, fileName = 'Report') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1', {
        views: [{ rightToLeft: true }] // Enable RTL for Arabic
    });

    // 1. Prepare Columns for Excel
    // We only take headers and ids/accessorKeys from the MRT columns
    const excelColumns = columns
        .filter(col => col.columnDef.header) // Ensure it has a header
        .map(col => ({
            header: col.columnDef.header,
            key: col.id,
            width: Math.max(col.columnDef.size / 6, 15) // Basic width calculation
        }));

    worksheet.columns = excelColumns;

    // 2. Format Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2196F3' } // Material Blue
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // 3. Add Data Rows
    data.forEach((row) => {
        const rowData = {};
        columns.forEach((col) => {
            const id = col.id;
            if (id) {
                // Get the value using the column id (which handles nested accessors)
                rowData[id] = row.getValue(id);
            }
        });
        worksheet.addRow(rowData);
    });

    // 4. Basic Styling for Data Rows
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.alignment = { vertical: 'middle', horizontal: 'right' }; // Align right for Arabic
            // Alternate colors
            if (rowNumber % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF5F5F5' }
                };
            }
        }
    });

    // 5. Generate and Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
};
