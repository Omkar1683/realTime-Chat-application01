package com.chatapp.tests;

import com.chatapp.base.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.UUID;

public class RegisterTest extends BaseTest {

    @Test(description = "Verify registration page loads")
    public void testRegisterPageLoads() {
        driver.get(BASE_URL + "/register");
        Assert.assertNotNull(driver.getTitle());
    }

    @Test(description = "Verify registration form has required fields")
    public void testRegisterFormElements() {
        driver.get(BASE_URL + "/register");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement usernameField = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("username"))
        );
        WebElement emailField    = driver.findElement(By.id("email"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement registerBtn   = driver.findElement(By.id("register-btn"));

        Assert.assertTrue(usernameField.isDisplayed());
        Assert.assertTrue(emailField.isDisplayed());
        Assert.assertTrue(passwordField.isDisplayed());
        Assert.assertTrue(registerBtn.isDisplayed());
    }

    @Test(description = "Verify successful new user registration")
    public void testSuccessfulRegistration() {
        driver.get(BASE_URL + "/register");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Use UUID to ensure unique email each run
        String uniqueEmail = "user_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")))
            .sendKeys("newuser");
        driver.findElement(By.id("email")).sendKeys(uniqueEmail);
        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.id("register-btn")).click();

        // Should redirect to chat/home after successful registration
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/");
    }

    @Test(description = "Verify error shown for duplicate email")
    public void testDuplicateEmailRegistration() {
        driver.get(BASE_URL + "/register");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")))
            .sendKeys("duplicateuser");
        driver.findElement(By.id("email")).sendKeys("testuser@example.com");
        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.id("register-btn")).click();

        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("error-message"))
        );
        Assert.assertTrue(errorMsg.isDisplayed(), "Error message should appear for duplicate email");
    }
}
