package com.employee.automation.runners;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

/**
 * EmployeeTestRunner — TestNG-based Cucumber runner.
 * Executes all Employee module feature files.
 * Report: reports/ExtentReport.html
 */
@CucumberOptions(
        features  = "src/test/resources/features",
        glue      = {
                "com.employee.automation.stepdefinitions",
                "com.employee.automation.hooks"
        },
        plugin    = {
                "pretty",
                "html:reports/cucumber/cucumber-report.html",
                "json:reports/cucumber/cucumber-report.json",
                "junit:reports/cucumber/cucumber-report.xml"
        },
        monochrome  = true,
        dryRun      = false,
        tags        = "@EmployeeModule or @Login"
)
public class EmployeeTestRunner extends AbstractTestNGCucumberTests {

    /**
     * Override to allow parallel scenario execution.
     * Set parallel = true for concurrent scenario execution.
     */
    @Override
    @DataProvider(parallel = false)
    public Object[][] scenarios() {
        return super.scenarios();
    }
}
