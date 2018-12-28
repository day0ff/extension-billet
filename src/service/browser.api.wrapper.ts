declare var browser: any;

class BrowserApiWrapper {
    private static _instance: BrowserApiWrapper;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private get isChrome(): boolean {
        return window.hasOwnProperty('chrome');
    }

    private get isSafari() {
        return window.hasOwnProperty('safari');
    }

    private get isFirefox() {
        return !this.isChrome && !this.isSafari;
    }

    public get browser(): any {
        if (this.isChrome) return chrome;
        if (this.isSafari) return safari;
        if (this.isFirefox) return browser;
        console.error(`Unsupported browser ${navigator.userAgent}`);
    }

}

export const web = BrowserApiWrapper.instance;