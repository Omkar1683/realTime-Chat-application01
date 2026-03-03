package com.chatapp.tests;

import com.chatapp.base.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;

public class ChatTest extends BaseTest {

    private WebDriverWait wait;

    @BeforeClass
    public void loginBeforeChat() {
        // This runs once before all tests in this class.
        // Each @Test method gets a fresh driver via BaseTest @BeforeMethod,
        // so we do the login inside each test.
    }

    /**
     * Helper: log in with credentials via the UI
     */
    private void loginAs(String email, String password) {
        driver.get(BASE_URL + "/login");
        WebDriverWait w = new WebDriverWait(driver, Duration.ofSeconds(10));
        w.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")))
         .sendKeys(email);
        driver.findElement(By.id("password")).sendKeys(password);
        driver.findElement(By.id("login-btn")).click();
        // Wait until redirect away from login
        w.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));
    }

    @Test(description = "Verify chat page loads after login")
    public void testChatPageLoads() {
        loginAs("testuser@example.com", "password123");
        WebDriverWait w = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Sidebar with contacts should appear
        WebElement sidebar = w.until(
            ExpectedConditions.presenceOfElementLocated(By.id("sidebar"))
        );
        Assert.assertTrue(sidebar.isDisplayed(), "Sidebar should be visible after login");
    }

    @Test(description = "Verify user list is shown in sidebar")
    public void testUserListVisible() {
        loginAs("testuser@example.com", "password123");
        WebDriverWait w = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Wait for at least one user item in sidebar
        WebElement userList = w.until(
            ExpectedConditions.presenceOfElementLocated(By.className("user-item"))
        );
        Assert.assertTrue(userList.isDisplayed(), "User list should appear in sidebar");
    }

    @Test(description = "Verify message input box is visible after selecting a contact")
    public void testMessageInputVisible() {
        loginAs("testuser@example.com", "password123");
        WebDriverWait w = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Click first contact in sidebar
        WebElement firstUser = w.until(
            ExpectedConditions.elementToBeClickable(By.className("user-item"))
        );
        firstUser.click();

        // Message input should appear
        WebElement msgInput = w.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("message-input"))
        );
        Assert.assertTrue(msgInput.isDisplayed(), "Message input should be visible");
    }

    @Test(description = "Verify sending a chat message")
    public void testSendMessage() {
        loginAs("testuser@example.com", "password123");
        WebDriverWait w = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Click first contact
        w.until(ExpectedConditions.elementToBeClickable(By.className("user-item"))).click();

        // Type a message
        WebElement msgInput = w.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("message-input"))
        );
        String testMessage = "Hello from Selenium TestNG!";
        msgInput.clear();
        msgInput.sendKeys(testMessage);

        // Click Send
        driver.findElement(By.id("send-btn")).click();

        // Verify the message appears in the chat window
        WebElement sentMsg = w.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath(
                "//*[contains(@class,'message-text') and contains(text(),'" + testMessage + "')]"
            ))
        );
        Assert.assertTrue(sentMsg.isDisplayed(), "Sent message should appear in chat window");
    }

    @Test(description = "Verify logout works correctly")
    public void testLogout() {
        loginAs("testuser@example.com", "password123");
        WebDriverWait w = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement logoutBtn = w.until(
            ExpectedConditions.elementToBeClickable(By.id("logout-btn"))
        );
        logoutBtn.click();

        // Should redirect back to login
        w.until(ExpectedConditions.urlContains("/login"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/login"), "Should redirect to login after logout");
    }
}
