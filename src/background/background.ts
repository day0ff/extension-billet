import { web } from '../service/browser.api.wrapper';

const permissions = ['chrome.com'];

console.log('Background script is running!');

web.browser.runtime.onInstalled.addListener(() => {

    web.browser.browserAction.disable();

    web.browser.tabs.onActivated.addListener((windowTab: any) => {
        web.browser.tabs.get(windowTab.tabId, (tab: any) => {
            enableExtension(windowTab.tabId, tab);
        });
    });

    web.browser.tabs.onUpdated.addListener((tabId: number, changeInfo: any, tab: any) => {
        enableExtension(tabId, tab);
    });

    window.setInterval(() => {
        web.browser.tabs.query({currentWindow: true, active: true}, (tabs: any) => {
            if (tabs.length && tabs[0].id) {
                web.browser.tabs.sendMessage(tabs[0].id,
                    {background: {message: 'Hello from background!'}}, (response: any) => {
                        if (response && response.content) console.log(response.content.response);
                    });
            }
        });
    }, 5000);


    web.browser.runtime.onMessage.addListener((receive: any, sender: any, sendResponse: any) => {
        if (receive && receive.content) console.log(receive.content.message);
        if (receive && receive.popup) console.log(receive.popup.message);
        sendResponse({background: {response: 'Response from Background!'}});
    });


    let cssFlag = false;
    let jsFlag = false;

    web.browser.commands.onCommand.addListener((command: any) => {
        console.log('Command:', command);
        if (command === 'injection') {
            web.browser.tabs.executeScript({file: 'scripts/injection.js'});
            web.browser.tabs.insertCSS({file: 'styles/injection.css'});
        }

        if (command === 'change-css') {
            if (cssFlag) {
                web.browser.tabs.insertCSS({code: 'body{border:solid 4px green}'});
                cssFlag = false;
            } else {
                web.browser.tabs.insertCSS({code: 'body{border:solid 4px red}'});
                cssFlag = true;
            }
        }

        if (command === 'change-js') {
            if (jsFlag) {
                web.browser.tabs
                    .executeScript({code: 'document.querySelectorAll("p").forEach(p=>p.style.color="gray")'});
                jsFlag = false;
            } else {
                web.browser.tabs
                    .executeScript({code: 'document.querySelectorAll("p").forEach(p=>p.style.color="red")'});
                jsFlag = true;
            }
        }
    });

});

function isEligible(url: string): boolean {
    return permissions.find((permission) => {
        return url.includes(permission);
    }) !== undefined;
}

function enableExtension(tabId: number, tab: any): void {
    if (isEligible(tab.url)) {
        web.browser.browserAction.enable(tabId);
    }
}
