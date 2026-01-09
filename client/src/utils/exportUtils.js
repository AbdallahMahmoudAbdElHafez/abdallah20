import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Professional palette for product groups (Soft, distinguishable colors)
const GROUP_COLORS = [
    'FFE3F2FD', // Light Blue
    'FFF3E5F5', // Light Purple
    'FFFEF3E2', // Light Orange
    'FFE8F5E9', // Light Green
    'FFFFF9C4', // Light Yellow
    'FFFCE4EC', // Light Pink
    'FFE0F2F1', // Light Teal
    'FFFFEBEE', // Light Red
];

/**
 * Common Excel export utility for reports
 * @param {Array} data - Array of objects to export (MRT Row Models)
 * @param {Array} columns - Visible columns from MaterialReactTable (getVisibleLeafColumns)
 * @param {string} fileName - Name of the file to save
 * @param {Object} options - Extra options like { freezeColumns: 1, heatmap: true }
 */
export const exportToExcel = async (data, columns, fileName = 'Report', options = {}) => {
    try {
        console.log(`Starting export: ${fileName}`, { dataCount: data.length, columnCount: columns.length });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1', {
            views: [{
                rightToLeft: true,
                state: 'frozen',
                xSplit: options.freezeColumns || 0,
                ySplit: 2 // Always freeze the 2-row header
            }]
        });

        // Color mapping state
        const groupColorMap = new Map();
        let colorIdx = 0;

        // --- 1. Setup Columns (Keys & Widths) ---
        worksheet.columns = columns.map(col => ({
            key: col.id,
            width: Math.max(col.columnDef.size / 7, 12)
        }));

        // --- 2. Construct Header Rows ---
        const row1 = worksheet.getRow(1);
        const row2 = worksheet.getRow(2);
        row1.height = 30;
        row2.height = 25;

        columns.forEach((col, index) => {
            const colNum = index + 1;
            const leafHeader = col.columnDef.header;
            const parentHeader = col.parent?.columnDef?.header || null;

            row2.getCell(colNum).value = leafHeader;
            row1.getCell(colNum).value = parentHeader || leafHeader;

            // Determine Color
            let bgColor = 'FF1976D2'; // Default Blue for non-grouped
            if (parentHeader) {
                if (!groupColorMap.has(parentHeader)) {
                    groupColorMap.set(parentHeader, GROUP_COLORS[colorIdx % GROUP_COLORS.length]);
                    colorIdx++;
                }
                bgColor = groupColorMap.get(parentHeader);
            }

            // Header Styles
            [row1.getCell(colNum), row2.getCell(colNum)].forEach(cell => {
                cell.font = {
                    bold: true,
                    color: { argb: parentHeader ? 'FF333333' : 'FFFFFFFF' },
                    size: 11
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: bgColor }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                };
            });
        });

        // --- 3. Merge Headers ---
        if (columns.length > 0) {
            let mergeStart = 1;
            let mergeValue = row1.getCell(1).value;

            for (let c = 2; c <= columns.length + 1; c++) {
                const val = c <= columns.length ? row1.getCell(c).value : null;
                if (val !== mergeValue) {
                    if (c - 1 > mergeStart) {
                        worksheet.mergeCells(1, mergeStart, 1, c - 1);
                    } else {
                        const colIndex = mergeStart - 1;
                        const hasParent = !!columns[colIndex]?.parent;
                        if (!hasParent) {
                            worksheet.mergeCells(1, mergeStart, 2, mergeStart);
                        }
                    }
                    mergeStart = c;
                    mergeValue = val;
                }
            }

            // Auto-filter
            worksheet.autoFilter = {
                from: { row: 2, column: 1 },
                to: { row: 2, column: columns.length }
            };
        }

        // --- 4. Add Data Rows ---
        data.forEach((row) => {
            const rowData = {};
            columns.forEach((col) => {
                const id = col.id;
                if (id) {
                    // Optimized extraction: works for Row objects or raw objects
                    let val = typeof row.getValue === 'function' ? row.getValue(id) : row[id];

                    // Fallback for nested IDs in raw objects (e.g. 'customer.name')
                    if (val === undefined && id.includes('.') && row.original) {
                        const parts = id.split('.');
                        let temp = row.original;
                        for (const part of parts) {
                            temp = temp?.[part];
                        }
                        val = temp;
                    }
                    // Final fallback
                    if (val === undefined && row.original) {
                        val = row.original[id];
                    }

                    if (typeof val === 'string' && !isNaN(val) && val.trim() !== '' && val.length < 15) {
                        val = parseFloat(val);
                    }
                    rowData[id] = val;
                }
            });
            worksheet.addRow(rowData);
        });

        // --- 5. Styling ---
        const lastDataRow = data.length + 2;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 2) {
                row.alignment = { vertical: 'middle', horizontal: 'right' };
                if (rowNumber % 2 !== 0) {
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
                }

                columns.forEach((col, idx) => {
                    const cell = row.getCell(idx + 1);
                    const headerLower = (col.columnDef.header || '').toLowerCase();
                    const isNumeric = typeof cell.value === 'number';

                    if (isNumeric) {
                        if (headerLower.includes('قيمة') || headerLower.includes('إجمالي') || headerLower.includes('سعر') || headerLower.includes('val')) {
                            cell.numFmt = '#,##0.00 "EGP"';
                        } else if (headerLower.includes('%') || headerLower.includes('خصم')) {
                            cell.numFmt = '0.0 "%"';
                        } else {
                            cell.numFmt = '#,##0';
                        }
                    }
                });
            }
        });

        // --- 6. Heatmap ---
        if (options.heatmap && data.length > 0) {
            columns.forEach((col, idx) => {
                const colLetter = worksheet.getColumn(idx + 1).letter;
                const headerLower = (col.columnDef.header || '').toLowerCase();
                if (['qty', 'كمية', 'قيمة', 'val', 'ربح', 'profit'].some(k => headerLower.includes(k))) {
                    worksheet.addConditionalFormatting({
                        ref: `${colLetter}3:${colLetter}${lastDataRow}`,
                        rules: [{
                            type: 'colorScale',
                            cfvo: [
                                { type: 'min' },
                                { type: 'percentile', value: 50 },
                                { type: 'max' }
                            ],
                            color: [
                                { argb: 'FFF8BBD0' }, // Light Pink
                                { argb: 'FFFFFFFF' }, // White
                                { argb: 'FFC8E6C9' }  // Light Green
                            ]
                        }]
                    });
                }
            });
        }

        // 7. Borders
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                if (!cell.border) {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                    };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${fileName}.xlsx`);
        console.log('Export successful');
    } catch (error) {
        console.error('Excel Export Error:', error);
        throw error; // Re-throw to handle in UI
    }
};
