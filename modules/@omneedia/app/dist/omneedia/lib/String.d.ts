export {  };
declare global  {
    interface String {
        padZero(length: number): any;
        latinize(): any;
        toDate(): any;
        isLatin(): boolean;
    }
}
export {};
