package com.employee.automation.utilities;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;

/**
 * CreateTestData — One-time utility to generate employee_data.xlsx.
 * Run this class as a standalone main() to create the Excel file.
 */
public class CreateTestData {

    private static final Logger log = LogManager.getLogger(CreateTestData.class);
    private static final String OUTPUT_PATH = "src/test/resources/testdata/employee_data.xlsx";

    public static void main(String[] args) throws IOException {
        createEmployeeDataExcel();
    }

    public static void createEmployeeDataExcel() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("EmployeeData");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontName("Arial");
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Headers
            String[] headers = {
                "name", "email", "phone", "department",
                "designation", "gender", "salary", "joiningDate"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 6000);
            }

            // Employee data rows (10 test employees)
            Object[][] data = {
                { "Alice Johnson",      "alice.johnson.{ts}@test.com",   "9876543201", "IT",      "Software Engineer",   "Female", "72000", "2024-01-15" },
                { "Bob Williams",       "bob.williams.{ts}@test.com",    "9876543202", "IT",      "Senior Developer",    "Male",   "95000", "2023-06-01" },
                { "Carol Davis",        "carol.davis.{ts}@test.com",     "9876543203", "IT",      "QA Engineer",         "Female", "65000", "2024-02-01" },
                { "David Martinez",     "david.martinez.{ts}@test.com",  "9876543204", "IT",      "DevOps Engineer",     "Male",   "85000", "2023-09-15" },
                { "Eve Thompson",       "eve.thompson.{ts}@test.com",    "9876543205", "IT",      "Product Manager",     "Female", "110000","2022-11-01" },
                { "Frank Garcia",       "frank.garcia.{ts}@test.com",    "9876543206", "IT",      "UI Designer",         "Male",   "68000", "2024-03-01" },
                { "Grace Lee",          "grace.lee.{ts}@test.com",       "9876543207", "IT",      "Data Analyst",        "Female", "78000", "2023-12-01" },
                { "Henry Wilson",       "henry.wilson.{ts}@test.com",    "9876543208", "IT",      "Backend Developer",   "Male",   "88000", "2024-01-01" },
                { "Irene Brown",        "irene.brown.{ts}@test.com",     "9876543209", "IT",      "Security Engineer",   "Female", "92000", "2023-07-15" },
                { "James Taylor",       "james.taylor.{ts}@test.com",    "9876543210", "IT",      "Cloud Architect",     "Male",   "120000","2022-08-01" }
            };

            for (int i = 0; i < data.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < data[i].length; j++) {
                    row.createCell(j).setCellValue(String.valueOf(data[i][j]));
                }
            }

            // Write to file
            File dir = new File("src/test/resources/testdata");
            if (!dir.exists()) dir.mkdirs();

            try (FileOutputStream fos = new FileOutputStream(OUTPUT_PATH)) {
                workbook.write(fos);
            }

            log.info("✓ employee_data.xlsx created at: {}", OUTPUT_PATH);
            System.out.println("✓ employee_data.xlsx created at: " + OUTPUT_PATH);
        }
    }
}
