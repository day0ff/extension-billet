import { BrowserApiWrapper } from '../service/browser.api.wrapper';

const permissions = ['chrome.com'];

class Background {
    public browser: BrowserApiWrapper;

    constructor(browser: BrowserApiWrapper) {
        console.log('Background script is running!');
        this.browser = browser;
    }

    public enableExtension(tabId: number, tab: any): void {
        if (this.isEligible(tab.url)) {
            background.browser.enable(tabId);
        } else {
            background.browser.disable();
        }
    }

    private isEligible(url: string): boolean {
        return permissions.find((permission) => {
            return url.includes(permission);
        }) !== undefined;
    }
}

const background = new Background(BrowserApiWrapper.instance);

background.browser.onInstalled(() => {
    console.log('Extension was successfully installed.');
    background.browser.disable();
});

background.browser.tabsOnActivated((activeInfo: any) => {
    background.browser.tabsGet(activeInfo.tabId)
        .then((tab: number) => {
            background.enableExtension(activeInfo.tabId, tab);
        }).catch(() => console.log('Can not enable extension on current tab.'));
});

background.browser.tabsOnUpdated((tabId: number, changeInfo: any, tab: any) => {
    background.enableExtension(tabId, tab);
});

window.setInterval(() => {
    background.browser.tabsQuery({currentWindow: true, active: true})
        .then((tabs: any) => {
            if (tabs.length && tabs[0].id) {
                background.browser.tabsSendMessage(tabs[0].id,
                    {background: {message: 'Hello from background!'}})
                    .then((response: any) => {
                        if (response && response.content) console.log(response.content.response);
                    }).catch(() => console.log('The current tab is not allowed in permissions.'));
            }
        });
}, 5000);


background.browser.receiveMessage((receive: any, sender: any, sendResponse: any) => {
    if (receive && receive.content) console.log(receive.content.message);
    if (receive && receive.popup) console.log(receive.popup.message);
    if (receive) sendResponse({background: {response: 'Response from Background!'}});
});


let cssFlag = false;
let jsFlag = false;

background.browser.receiveCommand((command: string) => {
    console.log('Command:', command);
    if (command === 'injection') {
        background.browser.executeScript(undefined, {file: 'scripts/injection.js'});
        background.browser.insertCSS(undefined, {file: 'styles/injection.css'});
    }

    if (command === 'change-css') {
        if (cssFlag) {
            background.browser.insertCSS(undefined, {code: 'body{border:solid 4px green}'});
            cssFlag = false;
        } else {
            background.browser.insertCSS(undefined, {code: 'body{border:solid 4px red}'});
            cssFlag = true;
        }
    }

    if (command === 'change-js') {
        if (jsFlag) {
            background.browser.executeScript(undefined,
                {code: 'document.querySelectorAll("p").forEach(p=>p.style.color="gray")'});
            jsFlag = false;
        } else {
            background.browser.executeScript(undefined,
                {code: 'document.querySelectorAll("p").forEach(p=>p.style.color="red")'});
            jsFlag = true;
        }
    }
});

