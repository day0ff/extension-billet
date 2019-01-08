import { BrowserApiWrapper } from '../service/browser.api.wrapper';

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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add').addEventListener('click', () => {
        popup.browser.storageSyncGet(['count'])
            .then((data: any) => {
                const count = data.count || 0;
                if (count) document.getElementById('count').textContent = `Count : ${count + 1}`;
                popup.browser.storageSyncSet({count: count + 1})
                    .catch(() => console.log('Can not save to sync storage.'));
            });
    });
});
