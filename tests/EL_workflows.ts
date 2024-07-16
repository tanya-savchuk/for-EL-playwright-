import { test, expect } from '@playwright/test';
import { TIMEOUT } from 'dns';
import { checkout_page } from './checkout_page';

const pageTitle = 'Estée Lauder | Beauty Products, Skin Care & Makeup'
const guestUserInfo = {
  'firstName': 'Test',
  'lastName': 'InProduction',
  'streeAddress': '123 Test Drive',
  'zipCode': '75206',
  'state': 'Texas',
  'city': 'Dallas',
  'phone': ' 2141234567',
  'email': 'mr_test@test.com',
  'card1': {
    'cardnumber': '4111111111111111',
    'exp-date': '12/25',
    'cvv': '123',
    'name': 'Test InProduction'
  }
}

test.beforeEach(async({page}) => {
  await page.goto('/');
});

test('Validate title on the main page', async ({ page }) => {
  await expect(page).toHaveTitle(pageTitle);
});

test('Add a product to the shopping bag workflow', async ({ page }) => {  
  await page.getByRole('link', { name: '/products/661/product-catalog' }).click();
  await page.locator('div:nth-child(2) > .elc-product-brief > .elc-product-image-section > .elc-clickable-wrapper').click();
  var productPrice = await page.locator('[data-test-id="product_price"]').locator('h4').innerText();
  console.log("product price",productPrice);  
  await page.locator('[data-test-id="add_to_bag_btn"]').click(); 
  // Open bag and verify the number of products in the cart 
  // and that the price of the product is correct
  await page.getByRole('button', { name: 'View my bag' }).click();
  await expect(page.locator('#order-summary-panel span').filter({ hasText: '$' })).toContainText(productPrice);  
  await expect(page.locator('#header-item-count')).toContainText('1');    
});

test('Guest checkout workflow', async ({ page }) => {
  test.slow();
  await page.getByRole('link', { name: '/products/661/product-catalog' }).click();
  await page.locator('div:nth-child(2) > .elc-product-brief > .elc-product-image-section > .elc-clickable-wrapper').click();
  await page.locator('[data-test-id="add_to_bag_btn"]').click();
  await page.getByRole('button', { name: 'View my bag' }).click();
  await page.getByRole('link', { name: 'Checkout' }).click();   
  await page.locator('[data-test-id="form_checkout_samples_continue"]').first().click();
  const checkoutPage = new checkout_page(page);
  await checkoutPage.startGuestCheckout(guestUserInfo.email);
  await checkoutPage.enterShippingAddress(guestUserInfo);
  // validate that user City and State are filled in correctly 
  await checkoutPage.validateUserDetails(guestUserInfo);
  await checkoutPage.continueCheckout();
  await checkoutPage.filloutPaymentInfo(guestUserInfo);
});