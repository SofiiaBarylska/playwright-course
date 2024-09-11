import { expect } from "@playwright/test"
import { Navigation } from "./Navigation.js"
import {isDesktopViewport} from "./../utils/isDesktopViewport.js"


export class ProductsPage {
    constructor(page) {
        this.page = page
        
        this.addButtons = page.locator('[data-qa="product-button"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.productTitle = page.locator('[data-qa="product-title"]')
        
    }


    visit = async () => {
        await this.page.goto("/")
    }



    addProductToBasket = async (index) => {
        const specificAddButton = this.addButtons.nth(index)
        await specificAddButton.waitFor() 
        //await specificAddButton
        await expect(specificAddButton).toHaveText("Add to Basket")
        const navigation = new Navigation(this.page)
        //only desktop viewport
        let basketCountBeforeAdding  //underfined
        if (isDesktopViewport(this.page)) {  //для десктопної версії ми створюємо умову, вписуємо this.page і ця page тупер доступна в цій функції
            basketCountBeforeAdding = await navigation.getBasketCount() 
        }
       
        await specificAddButton.click()
        await expect(specificAddButton).toHaveText("Remove from Basket")
        //only desktop viewport
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect (basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }
        

    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor() // чекаємо на дропдаун
        //get order of products
        await this.productTitle.first().waitFor()
        const productTitleBeforeSorting = await this.productTitle.allInnerTexts() //отримуємо значення з продукт тайтл
        await this.sortDropdown.selectOption("price-asc") //так як це є селектор, то можна використати функцію selectOption і обираєио опцію по найменшій ціні
        //get order of products
        const productTitleAfterSorting = await this.productTitle.allInnerTexts()
        expect (productTitleAfterSorting).not.toEqual(productTitleBeforeSorting) //порівнюємо після і до, без await тому що дії не асинхронні, а мають вже завершитися


        //expect that these lists are different
       

    }
}