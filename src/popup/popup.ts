import { BrowserApiWrapper } from '../browser-api/browser.api.wrapper';

class Popup {
    public browser: BrowserApiWrapper;

    constructor(browser: BrowserApiWrapper) {
        console.log('Popup is running!');
        this.browser = browser;
    }
}

const popup = new Popup(BrowserApiWrapper.instance);

popup.browser.sendMessage({popup: {message: 'Hello form popup!'}})
    .then((response: any) => {
        if (response && response.background) console.log(response.background.response);
    });

popup.browser.tabsQuery({currentWindow: true, active: true})
    .then((tabs: any) => {
        popup.browser.tabsSendMessage(tabs[0].id, {popup: {message: 'Hello from popup!'}})
            .then((response: any) => {
                if (response && response.content) console.log(response.content.response);
            });
    });

popup.browser.receiveCommand((command: any) => {
    console.log('Command:', command);
});

popup.browser.storageLocalGet(['count'])
    .then((data: any) => {
        const count = data.count || 0;
        if (count) document.getElementById('count').textContent = `Count : ${count}`;
        else popup.browser.storageLocalSet({count})
            .catch(() => console.log('Can not save to sync storage.'));
    });

popup.browser.storageOnChanged((changes: any, areaName: string) => {
    if (changes.count.newValue === 5) popup.browser.setBadgeBackgroundColor({color: '#FF6600'});
    if (changes.count.newValue === 10) popup.browser.setBadgeBackgroundColor({color: '#FF3300'});
    console.log(`Storage Sync count new value = ${changes.count.newValue}`);
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add').addEventListener('click', () => {
        popup.browser.storageLocalGet('count')
            .then((data: any) => {
                const count = data.count || 0;
                document.getElementById('count').textContent = `Count : ${count + 1}`;
                popup.browser.storageLocalSet({count: count + 1})
                    .catch(() => console.log('Can not save to sync storage.'));
            });
    });
    document.getElementById('clear').addEventListener('click', () => {
        popup.browser.storageLocalSet({count: 0})
            .then(() => {
                document.getElementById('count').textContent = `Count : 0`;
            });
    });
});