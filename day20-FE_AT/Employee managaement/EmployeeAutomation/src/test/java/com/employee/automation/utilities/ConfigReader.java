package com.employee.automation.utilities;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * ConfigReader — Singleton utility to read config.properties.
 * All keys are centralized here; no hard-coded values elsewhere.
 */
public class ConfigReader {

    private static final Logger log = LogManager.getLogger(ConfigReader.class);
    private static ConfigReader instance;
    private final Properties properties;

    private static final String CONFIG_PATH = "src/test/resources/config.properties";

    private ConfigReader() {
        properties = new Properties();
        try (FileInputStream fis = new FileInputStream(CONFIG_PATH)) {
            properties.load(fis);
            log.info("ConfigReader: config.properties loaded successfully.");
        } catch (IOException e) {
            log.error("ConfigReader: Failed to load config.properties — " + e.getMessage());
            throw new RuntimeException("Cannot load config.properties at: " + CONFIG_PATH, e);
        }
    }

    public static synchronized ConfigReader getInstance() {
        if (instance == null) {
            instance = new ConfigReader();
        }
        return instance;
    }

    public String get(String key) {
        String value = properties.getProperty(key);
        if (value == null) {
            log.warn("ConfigReader: Key not found — '" + key + "'");
        }
        return value;
    }

    public String getBaseUrl()          { return get("baseUrl"); }
    public String getAdminEmail()       { return get("adminEmail"); }
    public String getAdminPassword()    { return get("adminPassword"); }
    public String getApiBaseUrl()       { return get("apiBaseUrl"); }
    public String getEmployeeName()     { return get("empName"); }
    public String getEmployeeEmail()    { return get("empEmail"); }
    public String getEmployeePhone()    { return get("empPhone"); }
    public String getEmployeeDept()     { return get("empDept"); }
    public String getEmployeeDesig()    { return get("empDesignation"); }
    public String getEmployeeGender()   { return get("empGender"); }
    public String getEmployeeSalary()   { return get("empSalary"); }
    public String getExcelPath()        { return get("excelPath"); }
    public String getExcelSheet()       { return get("excelSheet"); }
}
