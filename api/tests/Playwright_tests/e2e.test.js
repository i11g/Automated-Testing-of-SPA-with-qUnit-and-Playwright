
const {describe, test, beforeEach, afterEach, beforeAll, beforeEach, afterAll, expect} = require('@playwright/test');
const {chromium} = require('palywright')

const host = "http:/localhost:3000"; 

let  browser;
let context;
let page; 

let usr= {
    email :"",
    password :"123456",
    confirmPass :"123456"
} 

describe("e2e tests", ()=>{
    beforeAll(async ()=>{
        browser=await chromium.launch();
    });

    afterAll(async ()=>{
        await browser.close(); 
    });

    beforeEach(async ()=> {
        context=await browser.newContext();
        page=await context.newPage()
    })

    afterEach(async ()=> {
        await page.close();
        await context.close(); 
    })
    describe("authentication", async ()=>{
        test("register with correct credentials makes corrext API call", async ()=>{
            //arrange
            await page.goto(host)
            let random=Math.floor(Math.random()*10000);
            user.mail=`abv${random}@abv.bg`
            
            //act
            await page.click("text=Register")
            await page.waitForSelector('form') 

            await page.locator('#email').fill(usr.email)
            await page.locator('#register-password').fill(user.password)
            await page.locator('confirm-password').fill(user.confirmPass) 

            let [response]= await Promise.all ([
                page.waitForResponse(response=>response.url().includes('/user/register')&&response.status()===200),
                page.click('[type=submit]')
            ])

            let userData=await response.json()

            //arrange
            await expect(response.ok).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(userData.password)

        })
    })
})

