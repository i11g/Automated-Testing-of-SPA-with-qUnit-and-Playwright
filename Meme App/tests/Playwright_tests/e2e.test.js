const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    username : "",
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
        test('registration wiht valid datt returns correctAPI calls', async()=>{
               //arrange
               await page.goto(host)
               await page.click('text=Register')
               await page.waitForSelector('form') 
               
               let random=Math.floor(Math.random()*1000) 
               let randomUserName=`username_${random}`
               let randomEmail=`abv${random}@abv.bg`
               user.email=randomEmail
               user.username=randomUserName


               //act
               await page.locator('#username').fill(user.username)
               await page.locator('#email').fill(user.email)
               await page.locator('#password').fill(user.password)
               await page.locator('#repeatPass').fill(user.confirmPass) 

               let [response]=await Promise.all([
                   page.waitForResponse(response=>response.url().includes('/users/register')&&response.status()===200),
                   page.click('[type="submit"]')
               ])
               
               let userData=await response.json()

               expect(response.ok).toBeTruthy()
               expect(userData.email).toEqual(user.email)
               expect(userData.password).toEqual(user.password)
               expect(userData.username).toEqual(user.username)               
        })
        test('login with valid data returns correct API calls', async()=>{
            //arrange   
               await page.goto(host)
               await page.click('text=Login')
               await page.waitForSelector('form')
               //act
               await page.locator('#email').fill(user.email)
               await page.locator('#password').fill(user.password)

               let [response] = await Promise.all([
                  page.waitForResponse(response=>response.url().includes('/users/login')&&response.status()===200),
                  page.click('[type="submit"]')
               ])
               //assert
               let loginData=await response.json()
               expect(response.ok).toBeTruthy()
               expect(loginData.email).toEqual(user.email)
               expect(loginData.password).toEqual(user.password)
               expect(loginData.username).toEqual(user.username)
        })
        test('logout returns correctAPI calls', async()=>{
                 //arrange   
               await page.goto(host)
               await page.click('text=Login')
               await page.waitForSelector('form')
               await page.locator('#email').fill(user.email)
               await page.locator('#password').fill(user.password)
               await page.click('[type="submit"]') 

               //act 
               let [response] = await Promise.all([
                page.waitForResponse(response=>response.url().includes('/users/logout')&&response.status()===204),
                page.click('text=Logout')
               ])
              
               //assert
               expect(response.ok).toBeTruthy()
               await page.waitForSelector('text=Login')
               expect(page.url()).toBe(host+'/')
        })
    })
    describe("navigation", ()=>{
        test('testing for navigation of loged-in user', async()=>{
            //assert&act   
            await page.goto(host)
            await page.click('text=Login')
            await page.waitForSelector('form')
            await page.locator('#email').fill(user.email)
            await page.locator('#password').fill(user.password)
            await page.click('[type="submit"]') 
            //asert

            await expect(page.locator('nav>>text=All Memes')).toBeVisible()
            await expect(page.locator('nav>>text=Create Meme')).toBeVisible()
            await expect(page.locator('nav>>text=My Profile')).toBeVisible()
            await expect(page.locator('nav>>text=Logout')).toBeVisible()

            await expect(page.locator('nav>>text=Login')).toBeHidden()
            await expect(page.locator('nav>>text=Register')).toBeHidden()
        })
        test('testing for navigation of guuest user', async()=>{
                //arrange&act
                await page.goto(host)
                //assert

                await expect(page.locator('nav>>text=Register')).toBeVisible()
                await expect(page.locator('nav>>text=Login')).toBeVisible()

                await expect(page.locator('nav>>text=AllMmemes')).toBeHidden()
                await expect(page.locator('nav>>text=Create Meme')).toBeHidden()
                await expect(page.locator('nav>>text=My Profile')).toBeHidden()
                await expect(page.locator('nav>>text=Logout')).toBeHidden()                
        })
    })
    describe("CRUD", ()=> {
        beforeEach(async()=>{
            await page.goto(host)
            await page.click('text=Login')
            await page.waitForSelector('form')
            await page.locator('#email').fill(user.email)
            await page.locator('#password').fill(user.password)
            await page.click('[type="submit"]') 
        })
        test('create a meme returns correctAPI calls', async()=>{
            //arrange   
               await page.click('text=Create Meme')
               await page.waitForSelector('form')
               
               //act 

               await page.fill('[name="title"]', 'Random title')
               await page.fill('[name="description"]', 'Random description')
               await page.fill('[name="imageUrl"]', "/images/1.png") 

               let [response]=await Promise.all([
                  page.waitForResponse(response=>response.url().includes('/data/memes')),
                  page.click('[type="submit"]')
               ]) 

               expect(response.ok).toBeTruthy()
               let createData=await response.json() 

               expect(createData.title).toEqual('Random title')
               expect(createData.description).toEqual("Random description")
               expect(createData.imageUrl).toEqual("/images/1.png")
        })
        test('edit meme returns correctAPI calls', async()=>{
                //arrange
                await page.locator('nav>>text=My Profile').click() 

                await page.locator('text=Details').first().click()
                await page.locator('text=Edit').click() 
                await page.waitForSelector('form') 
                //act
                await page.locator('[name="title"]').fill("Edited title") 

                let [response] = await Promise.all([
                   page.waitForResponse(response=>response.url().includes("/data/memes")&&response.status()===200),
                   page.click('[type="submit"]')
                ])
               
                expect(response.ok).toBeTruthy() 
                let editData=await response.json()
                expect( editData.title).toEqual('Edited title')
                expect(editData.description).toEqual("Random description")
                expect(editData.imageUrl).toEqual("/images/1.png")
        }) 
               
        test('delete meme returns correct API calls', async()=>{
               //arrange 
               await page.locator('nav>>text=My Profile').click() 
               await page.locator('text=Details').first().click()
               //act
               let [response] = await Promise.all([
                page.waitForResponse(response=>response.url().includes('/data/memes')&&response.status()===200),
                page.click('text=Delete')
             ])

             expect(response.ok),toBeTruthy() 
            
        })
    })

})
