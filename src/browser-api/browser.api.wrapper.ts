import 'chrome-extension-async';
import StorageObject = browser.storage.StorageObject;

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

    /**
     * @deprecated
     * Just for testing.
     */
    public get browser(): any {
        if (this.isFirefox) return browser;
        if (this.isChrome) return chrome;
        console.warn(`Environment is not defined.\n Browser :: ${navigator.userAgent}`);
        return browser;
    }

    public onInstalled(callback: () => void): void {
        if (this.isFirefox) return browser.runtime.onInstalled.addListener(callback);
        if (this.isChrome) return chrome.runtime.onInstalled.addListener(callback);
        return browser.runtime.onInstalled.addListener(callback);

    }

    public enable(tabId?: number): void {
        if (this.isFirefox) return browser.browserAction.enable(tabId);
        if (this.isChrome) return chrome.browserAction.enable(tabId);
        return browser.browserAction.enable(tabId);
    }

    public disable(tabId?: number): void {
        if (this.isFirefox) return browser.browserAction.disable(tabId);
        if (this.isChrome) return chrome.browserAction.disable(tabId);
        return browser.browserAction.disable(tabId);
    }

    public setBadgeText(details: { text: string | null; tabId?: number }): void {
        if (this.isFirefox) return browser.browserAction.setBadgeText(details);
        if (this.isChrome) return chrome.browserAction.setBadgeText(details);
        return browser.browserAction.setBadgeText(details);
    }

    public setBadgeBackgroundColor(details: { color: string | null; tabId?: number; }): void {
        if (this.isFirefox) return browser.browserAction.setBadgeBackgroundColor(details);
        if (this.isChrome) return chrome.browserAction.setBadgeBackgroundColor(details);
        return browser.browserAction.setBadgeBackgroundColor(details);
    }

    public sendMessage(message: any): Promise<any> {
        if (this.isFirefox) return browser.runtime.sendMessage(message);
        if (this.isChrome) return chrome.runtime.sendMessage(message);
        return browser.runtime.sendMessage(message);
    }

    public receiveMessage(callback: (receive: any, sender: any, sendResponse: any) => void): void {
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

    public tabsOnUpdated(callback: (tabId: number, changeInfo: any, tab: any) => void): void {
        if (this.isFirefox) return browser.tabs.onUpdated.addListener(callback);
        if (this.isChrome) return chrome.tabs.onUpdated.addListener(callback);
        return browser.tabs.onUpdated.addListener(callback);
    }

    public tabsGet(tabId: number, callback?: (tab: any) => void): Promise<any> {
        if (this.isFirefox) return browser.tabs.get(tabId).then(callback);
        if (this.isChrome) return chrome.tabs.get(tabId, callback);
        return browser.tabs.get(tabId).then(callback);
    }

    public tabsOnActivated(callback: (activeInfo: object) => void): void {
        if (this.isFirefox) return browser.tabs.onActivated.addListener(callback);
        if (this.isChrome) return chrome.tabs.onActivated.addListener(callback);
        return browser.tabs.onActivated.addListener(callback);
    }

    public receiveCommand(callback: (command: string) => void): void {
        if (this.isFirefox) return browser.commands.onCommand.addListener(callback);
        if (this.isChrome) return chrome.commands.onCommand.addListener(callback);
        return browser.commands.onCommand.addListener(callback);
    }

    public executeScript(tabId: number, details: object): Promise<any[]> {
        if (this.isFirefox) return browser.tabs.executeScript(tabId, details);
        if (this.isChrome) return chrome.tabs.executeScript(tabId, details);
        return browser.tabs.executeScript(tabId, details);
    }

    public insertCSS(tabId: number, details: object): Promise<void> {
        if (this.isFirefox) return browser.tabs.insertCSS(tabId, details);
        if (this.isChrome) return chrome.tabs.insertCSS(tabId, details);
        return browser.tabs.insertCSS(tabId, details);
    }

    public storageLocalGet(keys: string | string[] | object | StorageObject | null): Promise<{ [key: string]: any }> {
        if (this.isFirefox) return browser.storage.local.get(keys as StorageObject);
        if (this.isChrome) return chrome.storage.local.get(keys);
        return browser.storage.local.get(keys as StorageObject);
    }

    public storageLocalSet(items: object | StorageObject): Promise<void> {
        if (this.isFirefox) return browser.storage.local.set(items as StorageObject);
        if (this.isChrome) return chrome.storage.local.set(items);
        return browser.storage.local.set(items as StorageObject);
    }

    public storageSyncGet(keys: string | string[] | object | StorageObject | null): Promise<{ [key: string]: any }> {
        if (this.isFirefox) return browser.storage.sync.get(keys as StorageObject);
        if (this.isChrome) return chrome.storage.sync.get(keys);
        return browser.storage.sync.get(keys as StorageObject);
    }

    public storageSyncSet(items: object | StorageObject): Promise<void> {
        if (this.isFirefox) return browser.storage.sync.set(items as StorageObject);
        if (this.isChrome) return chrome.storage.sync.set(items);
        return browser.storage.sync.set(items as StorageObject);
    }

    public storageOnChanged(callback: (changes: object, areaName: string) => void): void {
        if (this.isFirefox) return browser.storage.onChanged.addListener(callback);
        if (this.isChrome) return chrome.storage.onChanged.addListener(callback);
        return browser.storage.onChanged.addListener(callback);
    }

    public localStorageGet(keyName: string): string {
        return localStorage.getItem(keyName);
    }

    public localStorageSet(keyName: string, keyValue: string): void {
        return localStorage.setItem(keyName, keyValue);
    }

    public localStorageRemoveItem(keyName: string): void {
        return localStorage.removeItem(keyName);
    }

    public localStorageClear(): void {
        return localStorage.clear();
    }

    public setIcon(details: object) {
        if (this.isFirefox) return browser.browserAction.setIcon(details);
        if (this.isChrome) return chrome.browserAction.setIcon(details);
        return browser.browserAction.setIcon(details);
    }

    private detectNamespace() {
        console.log(`browser = ${this.isFirefox}`);
        console.log(`chrome = ${this.isChrome}`);
    }

}