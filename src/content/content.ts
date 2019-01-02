import { web } from '../service/browser.api.wrapper';

console.log('Content script is running!');

web.browser.runtime.sendMessage({content: {message: 'Hello form content!'}}, (response: any) => {
    console.log(response.background.response);
});

web.browser.runtime.onMessage.addListener((receive: any, sender: any, sendResponse: any) => {
    if (receive && receive.popup) console.log(receive.popup.message);
    if (receive && receive.background) console.log(receive.background.message);
    sendResponse({content: {response: 'Response from Content!'}});
});
