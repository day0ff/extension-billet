import { web } from '../service/browser.api.wrapper';

console.log('Popup is running!');

web.browser.tabs.query({currentWindow: true, active: true}, (tabs: any) => {
    web.browser.tabs.sendMessage(tabs[0].id, {popup: {message: 'Hello from popup!'}}, (response: any) => {
        if (response && response.content) console.log(response.content.response);
    });
});

web.browser.runtime.sendMessage({popup: {message: 'Hello form popup!'}}, (response: any) => {
    if (response && response.background) console.log(response.background.response);
});

web.browser.commands.onCommand.addListener((command: any) => {
    console.log('Command:', command);
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add').addEventListener('click', () => {
        web.browser.storage.local.get(['count'], (data: any) => {
            const count = data.count || 0;
            if (count) document.getElementById('count').textContent = `Count : ${count + 1}`;
            web.browser.storage.local.set({count: count + 1});
        });
    });
});
