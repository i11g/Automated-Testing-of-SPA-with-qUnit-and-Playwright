const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test('register with valid data returns correct API calls', async()=>{
             //arrange 
              await page.goto(host)
              await page.click('text=Register')
              await page.waitForSelector('form') 
              
              let random=Math.floor(Math.random()*1000) 
              let randomEmail=`abv${random}@abv.bg`
              user.email=randomEmail


              //act 
              await page.locator('#email').fill(user.email)
              await page.locator('#password').fill(user.password)
              await page.locator('#repeat-pass').fill(user.confirmPass) 

              let [response] = await Promise.all([
                    page.waitForResponse(response=>response.url().includes("/users/register") && response.status()==200),
                    page.click('[type="submit"]')
              ])

              let jsonData=await response.json()

              expect(response.ok).toBeTruthy()
              expect(jsonData.email).toEqual(user.email)
              expect(jsonData.password).toEqual(user.password)
        })
        test("login wiht valid data returns correct API calls", async()=> {
               //arrange 
               await page.goto(host)
               await page.click('text=Login')
               await page.waitForSelector('form') 

               await page.locator('#email').fill(user.email)
               await page.locator('#password').fill(user.password)
               

               //act 

               let [response]=await Promise.all([
                   page.waitForResponse(response=>response.url().includes("/users/login") && response.status()==200),
                   page.click('[type="submit"]')
               ]) 

               //assert
               let loginData=await response.json()
               
               expect(response.ok).toBeTruthy()
               expect(loginData.email).toBe(user.email)
               expect(loginData.password).toBe(user.password)
        })
         test('logout returns correct API calls', async()=>{
               //arrange
               await page.goto(host)
               await page.click('text=Login')
               await page.waitForSelector('form')

               await page.locator('#email').fill(user.email)
               await page.locator('#password').fill(user.password)
               await page.click('[type="submit"]')

               //act

               let [response]=await Promise.all([
                    page.waitForResponse(response=>response.url().includes('/users/logout')&&response.status()==204),
                    page.click('text=Logout')
               ])

               //assert
               expect(response.ok).toBeTruthy()
               await page.waitForSelector('text=Login')
               expect(page.url()).toBe(host+'/')
         })
    })

    describe("navbar", () => { 
        test("testing navigation for logged-in users", async()=> {
            await page.goto(host)
            await page.click('text=Login')
            await page.waitForSelector('form')

            await page.locator('#email').fill(user.email)
            await page.locator('#password').fill(user.password)
            await page.click('[type="submit"]')

            await expect(page.locator('nav>> text=Dashboard')).toBeVisible()
            await expect(page.locator('nav>> text=My Books')).toBeVisible()
            await expect(page.locator('nav>> text=Add Book')).toBeVisible()
            await expect(page.locator('nav>> text=Logout')).toBeVisible()

            await expect(page.locator('nav>> text=Login')).toBeHidden()
            await expect(page.locator('nav>> text=Register')).toBeHidden()
        })
        test("testing navigation for guest users", async()=>{
            //arrange&act   
            await page.goto(host)
            //assert
            await expect(page.locator('text=Register')).toBeVisible()
            await expect(page.locator('text=Login')).toBeVisible()
            await expect(page.locator('nav>> text=Dashboard')).toBeVisible()

            await expect(page.locator('text=My books')).toBeHidden()
            await expect(page.locator('text=Add books')).toBeHidden()
            await expect(page.locator('text=Logout')).toBeHidden()

        })

    });

    describe("CRUD", () => {
              beforeEach(async()=>{
                        await page.goto(host)
                        await page.click('text=Login')
                        await page.waitForSelector('form')
                        await page.locator('#email').fill(user.email)
                        await page.locator('#password').fill(user.password)
                        await page.click('[type="submit"]')
              })
              test("create book returns correct API calls", async()=>{
                    //arrange 
                     await page.click('nav>> text=Add Book')
                     await page.waitForSelector('form')

                     await page.fill('[name="title"]', "Random title")
                     await page.fill('[name="description"]', "Random book description")
                     await page.fill('[name="imageUrl"]', "http://images/book.png")
                     await page.locator('#type').selectOption('Other') 
                  //act
                  let [response]=await Promise.all([
                       page.waitForResponse(response=>response.url().includes('/data/books')&&response.status()==200),
                       page.click('[type="submit"]')
                  ])
                  let createData=await response.json() 

                  //arrange
                  expect(response.ok).toBeTruthy()
                  expect(createData.title).toEqual('Random title')
                  expect(createData.description).toEqual('Random book description')
                  expect(createData.imageUrl).toEqual('http://images/book.png')  
                  expect(createData.type).toEqual('Other')                   
              })
              test("edit book returns correct API calls", async()=>{
                     await page.click('text=My Books')
                     await page.locator('text=Details').first().click()
                     await page.click('text=Edit')
                     await page.waitForSelector('form') 

                     await page.fill('[name="title"]', "Random edited title")
                     await page.locator('#type').selectOption('Other') 

                     let [response]=await Promise.all([
                         page.waitForResponse(response=>response.url().includes('/data/books')&&response.status()==200),
                         page.click('[type="submit"]')
                     ]) 

                     let editData=await response.json() 
                     
                     expect(response.ok).toBeTruthy()
                     expect(editData.title).toBe("Random edited title")
                     expect(editData.description).toBe("Random book description")
                     expect(editData.imageUrl).toBe("http://images/book.png")
                     expect(editData.type).toEqual('Other')
              })
    })
})