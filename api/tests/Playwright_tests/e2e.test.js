const {describe, test, beforeEach, afterEach, beforeAll, beforeEach, afterAll, expect}= require('@playwright/test');
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
})

