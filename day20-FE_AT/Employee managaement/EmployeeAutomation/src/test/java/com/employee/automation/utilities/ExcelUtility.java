package com.employee.automation.utilities;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.util.*;

/**
 * ExcelUtility — Apache POI-based Excel reader/writer.
 * Supports data-driven testing by reading employee records from Excel.
 */
public class ExcelUtility {

    private static final Logger log = LogManager.getLogger(ExcelUtility.class);

    private ExcelUtility() {}

    /**
     * Reads all rows from a sheet and returns as List of Maps (column header -> cell value).
     *
     * @param filePath  Absolute or relative path to the .xlsx file
     * @param sheetName Sheet name inside the workbook
     * @return List of row data maps
     */
    public static List<Map<String, String>> readAllRows(String filePath, String sheetName) {
        List<Map<String, String>> data = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                log.error("ExcelUtility: Sheet '{}' not found in '{}'", sheetName, filePath);
                return data;
            }

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                log.error("ExcelUtility: Header row is empty in sheet '{}'", sheetName);
                return data;
            }

            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(getCellValue(cell));
            }

            int lastRow = sheet.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Map<String, String> rowMap = new LinkedHashMap<>();
                boolean isEmptyRow = true;

                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String value = getCellValue(cell);
                    if (!value.isEmpty()) isEmptyRow = false;
                    rowMap.put(headers.get(j), value);
                }

                if (!isEmptyRow) {
                    data.add(rowMap);
                }
            }

            log.info("ExcelUtility: Read {} data rows from sheet '{}' in '{}'", data.size(), sheetName, filePath);

        } catch (IOException e) {
            log.error("ExcelUtility: Failed to read file '{}' — {}", filePath, e.getMessage());
        }

        return data;
    }

    /**
     * Reads a specific row by row index (0-based, excluding header).
     */
    public static Map<String, String> readRow(String filePath, String sheetName, int rowIndex) {
        List<Map<String, String>> allRows = readAllRows(filePath, sheetName);
        if (rowIndex < 0 || rowIndex >= allRows.size()) {
            log.error("ExcelUtility: Row index {} out of bounds (total rows: {})", rowIndex, allRows.size());
            return Collections.emptyMap();
        }
        return allRows.get(rowIndex);
    }

    /**
     * Converts a cell value to String, handling all cell types.
     */
    private static String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:  return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val)) return String.valueOf((long) val);
                return String.valueOf(val);
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try { return String.valueOf(cell.getNumericCellValue()); }
                catch (Exception e) { return cell.getStringCellValue().trim(); }
            default: return "";
        }
    }

    /**
     * Returns total number of data rows (excluding header).
     */
    public static int getRowCount(String filePath, String sheetName) {
        return readAllRows(filePath, sheetName).size();
    }
}
