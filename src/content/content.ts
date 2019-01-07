import {BrowserApiWrapper} from '../service/browser.api.wrapper';

class Content {
    public browser: BrowserApiWrapper;

    constructor(browser: BrowserApiWrapper) {
        console.log('Content script is running!');
        this.browser = browser;
    }
}

const content = new Content(BrowserApiWrapper.instance);

content.browser.sendMessage({content: {message: 'Hello form content!'}})
    .then((response: any) => {
        console.log(response.background.response);
    });

content.browser.receiveMessage((receive: any, sender: any, sendResponse: any) => {
    if (receive && receive.popup) console.log(receive.popup.message);
    if (receive && receive.background) console.log(receive.background.message);
    sendResponse({content: {response: 'Response from Content!'}});
});