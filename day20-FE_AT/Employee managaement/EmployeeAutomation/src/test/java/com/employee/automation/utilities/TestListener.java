package com.employee.automation.utilities;

import com.aventstack.extentreports.ExtentTest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.ITestListener;
import org.testng.ITestResult;

/**
 * TestListener — TestNG ITestListener for Extent Reports integration.
 * Automatically logs PASS/FAIL/SKIP and captures screenshots on failure.
 * Wire up via testng.xml <listeners> element or @Listeners annotation.
 */
public class TestListener implements ITestListener {

    private static final Logger log = LogManager.getLogger(TestListener.class);
    private static final ThreadLocal<ExtentTest> currentTest = new ThreadLocal<>();

    @Override
    public void onTestStart(ITestResult result) {
        String testName = result.getMethod().getDescription();
        if (testName == null || testName.isEmpty()) testName = result.getName();

        ExtentTest test = ExtentManager.getInstance().createTest(testName,
                "Class: " + result.getTestClass().getName());
        currentTest.set(test);
        test.info("Test started: " + testName);
        log.info("▶ TEST STARTED: {}", testName);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        log.info("✓ TEST PASSED: {}", result.getName());
        if (currentTest.get() != null) currentTest.get().pass("Test PASSED: " + result.getName());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        log.error("✗ TEST FAILED: {}", result.getName());
        if (result.getThrowable() != null) log.error("  Cause: {}", result.getThrowable().getMessage());
        if (currentTest.get() != null) currentTest.get().fail(result.getThrowable());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        log.warn("⤹ TEST SKIPPED: {}", result.getName());
        if (currentTest.get() != null) currentTest.get().skip("Test SKIPPED: " + result.getName());
    }

    @Override
    public void onFinish(org.testng.ITestContext context) {
        ExtentManager.flush();
        log.info("=== TEST EXECUTION COMPLETE ===");
        log.info("  PASSED : {}", context.getPassedTests().size());
        log.info("  FAILED : {}", context.getFailedTests().size());
        log.info("  SKIPPED: {}", context.getSkippedTests().size());
    }
}
