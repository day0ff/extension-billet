import { web } from '../service/browser.api.wrapper';

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
});

function enableExtension(tabId: number, tab: any): void {
    if (tab.url.includes('google.com')) {
        web.browser.browserAction.enable(tabId);
    }
}