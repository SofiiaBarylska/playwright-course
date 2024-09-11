
export class RegisterPage{
    constructor(page) {
        this.page = page

        this.emailInput = page.getByPlaceholder('e-mail')
        this.passwordInput = page.getByPlaceholder('password')
        this.registerButton = page.getByRole('button', { name: 'register' })
    }
    
    signUpAsNewUser = async (email, password) => {
        
        await this.emailInput.waitFor() //чекаємо на елемент
        // const emailId = uuidv4() //в змінну записали рандомне значення яке отримали з uuid
       // const email = emailId + "@gmail.com" //створили рандомного юзера
        await this.emailInput.fill(email) //заповнюємо поле
        await this.passwordInput.waitFor()  //чекаємо на елемент
        //const password = uuidv4() //в змінну записали рандомне значення яке отримали з uuid
        await this.passwordInput.fill(password) //заповнюємо поле
        await this.registerButton.waitFor() //чекаємо на елемент
        await this.registerButton.click() //натискаємо на кнопку
        
}


}