import { expect } from "@playwright/test"

export class Checkout {
    constructor(page) {
        this.page = page

        this.basketCards = page.locator('[data-qa="basket-card"]')
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]')
        this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]')
        this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]')
    }

    removeCheapestProduct = async () => {
        await this.basketCards.first().waitFor() //чекаємо на перший елемент
        const itemsBeforeRemoval = await this.basketCards.count() //підраховуємо кількість в корзині
        await this.basketItemPrice.first().waitFor()  //чекаємо на першу ціну, чи вона є
        const allPriceTexts = await this.basketItemPrice.allInnerTexts() //витягуємо значення з цін, буде у вигляді рядка з доларом
        const justNumbers = allPriceTexts.map((element) => { //завдяки функції меп, ми створюємо нове значення і перезаписуємо кожний елемент без долара
            const withoutDollarSign = element.replace("$", "") // 499$ -> '499'
            return parseInt(withoutDollarSign, 10) //повертаємо у десятковому вигляді і це все повертається в justNumbers
        })
        const smallestPrice = Math.min(...justNumbers) //знаходимо найменше значення
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice) //знаходимо найменше значення в масиві
        const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx) //по найменшому значенню ми знайшли кнопку ремув
        await specificRemoveButton.waitFor() //чекаємо на ремув елемент
        await specificRemoveButton.click() //провіряємо
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1) //

        
    }
    continueToCheckout = async () => {
        await this.continueToCheckoutButton.waitFor()
        await this.continueToCheckoutButton.click()
        await this.page.waitForURL(/\/login/gm, {timeout: 3000})

    }

}