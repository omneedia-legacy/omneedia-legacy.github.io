import './lib/String';
import './lib/Date';
export declare class App {
    constructor();
    isBlur: boolean;
    version: '0.9.0';
    versionDetail: {
        major: 0;
        minor: 9;
        patch: 0;
    };
    static onReady(): void;
    static blur(): void;
    static unblur(): void;
    static uuid(): string;
    IOKey: any;
}
