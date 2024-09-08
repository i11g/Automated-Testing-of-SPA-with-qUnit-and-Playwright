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

let pet = {
    age : "2 years",
    name : "",
    breed : "Random breed",
    image : "/images/cat-create.jpg",
    weight  : "2 kg"
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
        test("register makes correct api call", async () => {
            
            await page.goto(host);
            await page.click("text=Register");
            await page.waitForSelector('form');
            let random = Math.floor(Math.random()*10000);
            user.email = `abv${random}@abv.bg`;

            
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#repeatPassword').fill(user.confirmPass);
            
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/register") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            
            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);

        })
        test("login makes correct api call", async () => {
            
            await page.goto(host);
            await page.click('text=Login')
            await page.waitForSelector('form');
            
            
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            
            
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        })
        test("logout makes correct api call", async () => {
            
            await page.goto(host);
            await page.click('text=Login')
            await page.waitForSelector('form');
            
            
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]')
            
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/logout") && response.status() == 204),
                page.locator('nav >> text=Logout').click()
            ])
            
            expect(response.ok()).toBeTruthy();
            
            await page.waitForSelector('nav >> text=Login')
            expect(page.url()).toBe(host + '/');
        })        
    })

    describe("navbar", () => {
        test("logged user should see correct navigation buttons", async()=>{
            
            await page.goto(host);

            
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');

            
            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
            await expect(page.locator('nav >> text=Create Postcard')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();
        })
        test("guest user should see correct navigation buttons", async()=>{
            
            await page.goto(host);          
                       
            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
            await expect(page.locator('nav >> text=Create Postcard')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();
        })
    });

    describe("CRUD", () => {
        beforeEach(async () =>{
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.click('[type="submit"]');
        })
        test('create makes correct API call', async()=>{
            
            await page.click('nav >> text=Create Postcard');
            await page.waitForSelector("form");
            
            let random = Math.floor(Math.random() * 10000);

            let randomName=`Random name_${random}`;
            pet.name=randomName;
            
            
            await page.locator('#name').fill(pet.name)
            await page.locator('#breed').fill(pet.breed)
            await page.locator('#age').fill(pet.age)
            await page.locator('#weight').fill(pet.weight)
            await page.locator('#image').fill(pet.image)
            
            
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() == 200 ),
                page.click('[type="submit"]')
            ]);

            let petData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(petData.name).toEqual(pet.name);
            expect(petData.breed).toEqual(pet.breed);
            expect(petData.age).toEqual(pet.age);
            expect(petData.weight).toEqual(pet.weight);
            expect(petData.image).toEqual(pet.image);
        })

        test('edit makes correct API call', async () => {
            
            await page.click("nav >> text=Dashboard");

            await page.locator("//div[@class='animals-board']//div[@class='action']//a[@class='btn']").first().click();
            
            await page.click("text=Edit");
            await page.waitForSelector('form');                  

            let editedAge="2 years_edited"
            pet.age=editedAge
            await page.locator('#age').fill(pet.age) 
            
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() == 200 ),
                page.click('[type="submit"]')
            ]);

            let petData = await response.json();

            expect(response.ok()).toBeTruthy();
            expect(petData.name).toEqual(pet.name);
            expect(petData.breed).toEqual(pet.breed);
            expect(petData.age).toEqual(pet.age);
            expect(petData.weight).toEqual(pet.weight);
            expect(petData.image).toEqual(pet.image);          
            
        })
        test("delete makes correct API call", async()=>{
            
            await page.click("nav >> text=Dashboard");

            await page.locator("//div[@class='animals-board']//div[@class='action']//a[@class='btn']").first().click();

            
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() == 200 ),
                page.on('dialog', dialog => dialog.accept()),
                page.click('text=delete')
            ]);

           
            expect(response.ok()).toBeTruthy();
        })
          
    })
})