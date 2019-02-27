import { BrowserApiWrapper } from '../browser-api/browser.api.wrapper';

const permissions = ['chrome.com'];

class Background {
    public browser: BrowserApiWrapper;
    public cssFlag: boolean;
    public jsFlag: boolean;
    public iconFlag: boolean;

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

background.browser.receiveCommand((command: string) => {
    console.log('Command:', command);
    if (command === 'injection') {
        background.browser.executeScript(undefined, {file: 'scripts/injection.js'});
        background.browser.insertCSS(undefined, {file: 'styles/injection.css'});
    }

    if (command === 'change-css') {
        if (background.cssFlag) background.browser.insertCSS(undefined, {code: 'body{border:solid 4px green}'});
        else background.browser.insertCSS(undefined, {code: 'body{border:solid 4px red}'});
        background.cssFlag = !background.cssFlag;
    }

    if (command === 'change-js') {
        if (background.jsFlag) background.browser.executeScript(undefined,
            {code: 'document.querySelectorAll("p").forEach(p=>p.style.color="gray")'});
        else background.browser.executeScript(undefined,
            {code: 'document.querySelectorAll("p").forEach(p=>p.style.color="red")'});
        background.jsFlag = !background.jsFlag;
    }

    if (command === 'change-icon') {
        // You can not use icons more then 196px * 196px resolution.
        if (background.iconFlag) background.browser.setIcon({
            path: {
                16: 'icons/icon16.png',
                32: 'icons/icon32.png',
                48: 'icons/icon48.png',
                64: 'icons/icon64.png',
                128: 'icons/icon128.png'
            }
        });
        else background.browser.setIcon({
            path: {
                16: 'icons/icon16invert.png',
                32: 'icons/icon32invert.png',
                48: 'icons/icon48invert.png',
                64: 'icons/icon64invert.png',
                128: 'icons/icon128invert.png'
            }
        });
        background.iconFlag = !background.iconFlag;
    }
});

background.browser.storageLocalGet(['count'])
    .then((data: any) => {
        const count = data.count || 0;
        console.log(`Storage Sync count = ${count}`);
        background.browser.setBadgeText({text: count.toString()});
        if (count === 0) {
            background.browser.setBadgeBackgroundColor({color: '#0099FF'});
            background.browser.setBadgeText({text: ''});
        }
    });

background.browser.storageOnChanged((changes: any, areaName: string) => {
    background.browser.setBadgeText({text: changes.count.newValue.toString()});
    if (changes.count.newValue === 0) {
        background.browser.setBadgeBackgroundColor({color: '#0099FF'});
        background.browser.setBadgeText({text: ''});
    }
    console.log(`Storage Sync count new value = ${changes.count.newValue}`);
});