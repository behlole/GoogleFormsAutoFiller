"use strict"
const puppeteer = require('puppeteer')
const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSfWZN-XWogm7bRUhdX0q02gM4GpwFOOI3nEVPM5nQlhxBvfwQ/viewform?usp=sf_link";

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
fill(formLink, true);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function fill(formLink, submitForm) {
    let browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    try {
        let jobTitles = [
            "Software Engineer",
            "Teacher",
            "Professor",
            "HR",
            "Technical Manager",
            "Developer"
        ]

        let experiences = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7'
        ]
        console.log("Connecting into the network");
        await page.goto(
            formLink,
            {
                waitUntil: 'networkidle2'
            });
        const submitButton = await page.$x("//span[contains(text(), 'Submit')]");
        const selectors = await page.$$('.docssharedWizToggleLabeledContainer');
        const inputElements = await page.$$('.whsOnd');
        let inputIndex = 0
        for (const singleInputElement of inputElements) {
            await singleInputElement.click();
            if (inputIndex === 0) {
                await page.keyboard.type(jobTitles.random())
            } else {
                await page.keyboard.type(experiences.random())
            }
            inputIndex = inputIndex + 1;

        }

        console.log("Selecting choices");

        for (const singleSelector of selectors) {
            await singleSelector.click();
        }
        if (submitButton) {
            await page.waitForTimeout(500);
            await submitButton[0].click();
            await page.waitForNavigation();
            const submissionPage = page.url();
            console.log(submissionPage);
            if (submissionPage.includes("formResponse")) {
                console.log("Form Submitted Successfully");
            }
            console.log("closing page");
            console.log("closing browser")
            await page.close();
            await browser.close();
        }
    } catch (e) {
        console.log(e.message);
    }
}