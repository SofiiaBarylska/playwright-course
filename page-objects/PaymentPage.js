import { expect } from "@playwright/test"
export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
            .locator('[data-qa="discount-code"]')
        //new element for the discount input
        this.discountInput = page.locator('[data-qa="discount-code-input"]')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.discountActivatedMessage = page.locator('[data-qa="discount-active-message"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountValue = page.locator('[data-qa="total-with-discount-value"]')
        this.creditCardOwnerInput = page.locator('[data-qa="credit-card-owner"]')
        this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]')
        this.creditCardValidUntilInput = page.locator('[data-qa="valid-until"]')
        this.creditCardCvcInput = page.locator('[data-qa="credit-card-cvc"]')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()//витягуємо текст з кентейнеру за допомогою методу функції плейврайт
        await this.discountInput.waitFor()
        //Option 1 (correct work) need to fill out the discount input: using .fill() with await expect()
        await this.discountInput.fill(code) //wait to see that the input contains the value which was entered
        await expect(this.discountInput).toHaveValue(code)
        
        //Option 2 for laggy inputs: slow typing
        // await this.discountInput.focus()
        // await this.page.keyboard.type(code, { delay: 1000 })
        // expect (await this.discountInput.inputValue()).toBe(code)
        await this.activateDiscountButton.waitFor()
        // expect (this.discountActivatedMessage).toBeHidden
        expect(await this.discountActivatedMessage.isVisible()).toBe(false)
        expect(await this.discountValue.isVisible()).toBe(false)
        await this.activateDiscountButton.click()
        await this.discountActivatedMessage.waitFor()
        expect(this.discountActivatedMessage).toContainText("Discount activated!")
        await this.discountValue.waitFor()
        const discountValueText = await this.discountValue.innerText()
        const discountValueOnlyNumber = discountValueText.replace("$", "")
        const discountValueNumber = parseInt(discountValueOnlyNumber, 10)

        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText()
        const totalValueOnlyNumber = totalValueText.replace("$", "")
        const totalValueNumber = parseInt(totalValueOnlyNumber, 10)
        
        expect(discountValueNumber).toBeLessThan(totalValueNumber)
        //await this.page.pause()

    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwnerInput.waitFor()
        await this.creditCardOwnerInput.fill(paymentDetails.owner)
        await this.creditCardNumberInput.waitFor()
        await this.creditCardNumberInput.fill(paymentDetails.number)
        await this.creditCardValidUntilInput.waitFor()
        await this.creditCardValidUntilInput.fill(paymentDetails.validUntil)
        await this.creditCardCvcInput.waitFor()
        await this.creditCardCvcInput.fill(paymentDetails.cvc)
        

    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}