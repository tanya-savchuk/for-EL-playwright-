import { expect, type Locator, type Page } from '@playwright/test';

export class checkout_page {
  readonly page: Page;  

  constructor(page: Page){
    this.page = page;
  }

  async selectSamples(n){
    // to be implemented
  }

  async startGuestCheckout(userEmail){
    await this.page.getByText('GUEST CHECKOUT').click();
    await this.page.locator('[data-test-id="form_signin_new_user_email"]').click();
    await this.page.fill('[data-test-id="form_signin_new_user_email"]', userEmail);
    await this.page.locator('[data-test-id="form_checkout_signin_new_user_submit"]').click();    
  }

  async enterShippingAddress(userInfo) {
    await this.page.fill('[data-test-id="shipping-first-name-input"]', userInfo.firstName);  
    await this.page.fill('[data-test-id="shipping-last-name-input"]', userInfo.lastName);
    await this.page.fill('[data-test-id="shipping-address1-input"]', userInfo.streeAddress);
    await this.page.fill('[data-test-id="form_address_zipcode_field"]', userInfo.zipCode);
    await this.page.locator('[data-test-id="form_phone_field"]').pressSequentially(userInfo.phone, {delay:100});
  }

  async validateUserDetails(userInfo) {
    await expect(this.page.locator('[data-test-id="shipping-city-input"]')).toHaveValue(userInfo.city);
    await expect(this.page.locator('[data-test-id="shipping-state-input"]').first()).toHaveText(userInfo.state);
  }

  async continueCheckout(){
    await this.page.locator('[data-test-id="dp_continue_checkout"]').click();
  }

  async filloutPaymentInfo(userInfo){
    // to be implemented
  }
}