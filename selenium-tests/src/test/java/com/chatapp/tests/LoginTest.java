package com.chatapp.tests;

import com.chatapp.base.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginTest extends BaseTest {

    @Test(description = "Verify login page loads correctly")
    public void testLoginPageLoads() {
        driver.get(BASE_URL + "/login");
        String title = driver.getTitle();
        Assert.assertNotNull(title, "Page title should not be null");
        System.out.println("Page title: " + title);
    }

    @Test(description = "Verify login form elements exist")
    public void testLoginFormElements() {
        driver.get(BASE_URL + "/login");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Check email and password fields exist
        WebElement emailField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("email"))
        );
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement loginBtn = driver.findElement(By.id("login-btn"));

        Assert.assertTrue(emailField.isDisplayed(), "Email field should be visible");
        Assert.assertTrue(passwordField.isDisplayed(), "Password field should be visible");
        Assert.assertTrue(loginBtn.isDisplayed(), "Login button should be visible");
    }

    @Test(description = "Verify login with valid credentials")
    public void testValidLogin() {
        driver.get(BASE_URL + "/login");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement emailField = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email"))
        );
        emailField.clear();
        emailField.sendKeys("testuser@example.com");

        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.id("login-btn")).click();

        // After login, should redirect to home/chat page
        wait.until(ExpectedConditions.urlContains("/"));
        String currentUrl = driver.getCurrentUrl();
        Assert.assertFalse(currentUrl.contains("/login"), "Should redirect away from login page");
    }

    @Test(description = "Verify login fails with wrong password")
    public void testInvalidLogin() {
        driver.get(BASE_URL + "/login");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement emailField = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email"))
        );
        emailField.clear();
        emailField.sendKeys("testuser@example.com");
        driver.findElement(By.id("password")).sendKeys("wrongpassword");
        driver.findElement(By.id("login-btn")).click();

        // Expect an error message
        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("error-message"))
        );
        Assert.assertTrue(errorMsg.isDisplayed(), "Error message should be shown on invalid login");
    }
}
