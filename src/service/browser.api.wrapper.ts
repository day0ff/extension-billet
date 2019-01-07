import 'chrome-extension-async';

export class BrowserApiWrapper {
    private static _instance: BrowserApiWrapper;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private get isFirefox() {
        return window.hasOwnProperty('browser');
    }

    private get isChrome(): boolean {
        return window.hasOwnProperty('chrome');
    }

    public get browser(): any {
        if (this.isFirefox) return browser;
        if (this.isChrome) return chrome;
        console.warn(`Environment is not defined.\n Browser :: ${navigator.userAgent}`);
        return browser;
    }

    public sendMessage(message: any): Promise<any> {
        if (this.isFirefox) return browser.runtime.sendMessage(message);
        if (this.isChrome) return chrome.runtime.sendMessage(message);
        return browser.runtime.sendMessage(message);
    }

    public receiveMessage(callback: (receive: any, sender: any, sendResponse: any) => void): any {
        if (this.isFirefox) return browser.runtime.onMessage.addListener(callback);
        if (this.isChrome) return chrome.runtime.onMessage.addListener(callback);
        return browser.runtime.onMessage.addListener(callback);
    }

    public tabsQuery(queryInfo: object): Promise<any> {
        if (this.isFirefox) return browser.tabs.query(queryInfo);
        if (this.isChrome) return chrome.tabs.query(queryInfo);
        return browser.tabs.query(queryInfo);
    }

    public tabsSendMessage(tabId: number, message: any, options?: object): Promise<any> {
        if (this.isFirefox) return browser.tabs.sendMessage(tabId, message, options);
        if (this.isChrome) return chrome.tabs.sendMessage(tabId, message, options);
        return browser.tabs.sendMessage(tabId, message, options);
    }

    public receiveCommand(callback: (command: string) => void): void {
        console.log('receiveCommand');
        this.detectNamespace();
        if (this.isFirefox) return browser.commands.onCommand.addListener(callback);
        if (this.isChrome) return chrome.commands.onCommand.addListener(callback);
        return browser.commands.onCommand.addListener(callback);
    }

    public executeScript(tabId: number, details: object): Promise<any> {
        if (this.isFirefox) return browser.tabs.executeScript(tabId, details);
        if (this.isChrome) return chrome.tabs.executeScript(tabId, details);
        return browser.tabs.executeScript(tabId, details);
    }

    public insertCSS(tabId: number, details: object): Promise<any> {
        if (this.isFirefox) return browser.tabs.insertCSS(tabId, details);
        if (this.isChrome) return chrome.tabs.insertCSS(tabId, details);
        return browser.tabs.insertCSS(tabId, details);
    }

    private detectNamespace() {
        console.log(`browser = ${this.isFirefox}`);
        console.log(`chrome = ${this.isChrome}`);
    }
}

export const web = BrowserApiWrapper.instance;