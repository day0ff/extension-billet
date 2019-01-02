declare var browser: any;

class BrowserApiWrapper {
    private static _instance: BrowserApiWrapper;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private get isFirefox() {
        return window.hasOwnProperty('browser');
    }

    private get isSafari() {
        return window.hasOwnProperty('safari');
    }

    private get isChrome(): boolean {
        return window.hasOwnProperty('chrome');
    }

    public get browser(): any {
        if (this.isFirefox) return browser;
        if (this.isSafari) return safari;
        if (this.isChrome) return chrome;
        console.error(`Unsupported browser ${navigator.userAgent}`);
    }

}

export const web = BrowserApiWrapper.instance;