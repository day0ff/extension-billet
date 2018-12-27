chrome.runtime.onInstalled.addListener(() => {
    chrome.browserAction.disable();
    chrome.tabs.onActivated.addListener((windowTab) => {
        chrome.tabs.get(windowTab.tabId, (tab) => {
            enableExtension(windowTab.tabId, tab);
        });
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        enableExtension(tabId, tab);
    });
});

function enableExtension(tabId: number, tab: any): void {
    if (tab.url.includes('google.com')) {
        chrome.browserAction.enable(tabId);
    }
}