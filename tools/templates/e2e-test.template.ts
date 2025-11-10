import { test, expect } from '@playwright/test';

// E2E tests for user workflows
test.describe('User Workflow: Create and Edit Note', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Login if needed
    // await page.fill('[data-testid="email"]', 'test@example.com');
    // await page.fill('[data-testid="password"]', 'password');
    // await page.click('[data-testid="login-btn"]');
  });

  test('should create a new note', async ({ page }) => {
    // Click new note button
    await page.click('[data-testid="new-note-btn"]');

    // Fill in note details
    await page.fill('[data-testid="note-title"]', 'Test Note');
    await page.fill('[data-testid="note-description"]', 'This is a test note');

    // Save note
    await page.click('[data-testid="save-note-btn"]');

    // Verify note appears in list
    await expect(page.locator('[data-testid="note-card"]').first()).toContainText('Test Note');
  });

  test('should edit existing note', async ({ page }) => {
    // Create a note first
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'Original Title');
    await page.click('[data-testid="save-note-btn"]');

    // Edit the note
    await page.click('[data-testid="note-card"]').first();
    await page.fill('[data-testid="note-title"]', 'Updated Title');
    await page.click('[data-testid="save-note-btn"]');

    // Verify update
    await expect(page.locator('[data-testid="note-card"]').first()).toContainText(
      'Updated Title'
    );
  });

  test('should delete note', async ({ page }) => {
    // Create a note
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'To Delete');
    await page.click('[data-testid="save-note-btn"]');

    // Delete note
    await page.click('[data-testid="note-card"]').first();
    await page.click('[data-testid="delete-note-btn"]');
    await page.click('[data-testid="confirm-delete-btn"]');

    // Verify note is in trash
    await page.goto('/trash');
    await expect(page.locator('[data-testid="note-card"]').first()).toContainText('To Delete');
  });

  test('should work offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Create note offline
    await page.click('[data-testid="new-note-btn"]');
    await page.fill('[data-testid="note-title"]', 'Offline Note');
    await page.click('[data-testid="save-note-btn"]');

    // Verify offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Wait for sync
    await expect(page.locator('[data-testid="sync-indicator"]')).toHaveText('Synced');
  });
});
