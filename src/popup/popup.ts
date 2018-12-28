import { web } from '../service/browser.api.wrapper';

console.log('Popup is running!');

web.browser.tabs.query({currentWindow: true, active: true}, (tabs: any) => {
    web.browser.tabs.sendMessage(tabs[0].id, {popup: {message: 'Hello from popup!'}}, (response: any) => {
        if (response.content) console.log(response.content.response);
    });
});

web.browser.runtime.sendMessage({popup: {message: 'Hello form popup!'}}, (response: any) => {
    if (response.background) console.log(response.background.response);
});


