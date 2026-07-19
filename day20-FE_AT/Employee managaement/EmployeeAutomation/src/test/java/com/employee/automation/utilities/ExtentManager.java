package com.employee.automation.utilities;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;

/**
 * ExtentManager — Thread-safe singleton for ExtentReports.
 * Initialized once; flushed at suite end.
 */
public class ExtentManager {

    private static final Logger log = LogManager.getLogger(ExtentManager.class);
    private static ExtentReports extentReports;

    private ExtentManager() {}

    public static synchronized ExtentReports getInstance() {
        if (extentReports == null) {
            File reportDir = new File("reports");
            if (!reportDir.exists()) reportDir.mkdirs();

            ExtentSparkReporter sparkReporter = new ExtentSparkReporter("reports/ExtentReport.html");
            sparkReporter.config().setTheme(Theme.DARK);
            sparkReporter.config().setDocumentTitle("Employee Module Automation Report");
            sparkReporter.config().setReportName("Employee Module — BDD Test Execution Report");
            sparkReporter.config().setEncoding("utf-8");

            extentReports = new ExtentReports();
            extentReports.attachReporter(sparkReporter);
            extentReports.setSystemInfo("Framework",    "Selenium + Cucumber BDD + TestNG");
            extentReports.setSystemInfo("Browser",      "Chrome");
            extentReports.setSystemInfo("Environment",  "Local QA");
            extentReports.setSystemInfo("Application",  "Employee Management System");
            extentReports.setSystemInfo("OS",           System.getProperty("os.name"));
            extentReports.setSystemInfo("Java Version", System.getProperty("java.version"));

            log.info("ExtentManager: ExtentReports initialized.");
        }
        return extentReports;
    }

    public static synchronized void flush() {
        if (extentReports != null) {
            extentReports.flush();
            log.info("ExtentManager: Report flushed successfully.");
        }
    }
}
