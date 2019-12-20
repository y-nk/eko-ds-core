export declare const equal: <T>(a: T[], b: T[]) => boolean;
export declare const indexesOf: <T>(needle: T[], haystack: T[]) => number[];
export declare const replaceBy: <T>(pattern: T[], item: T, source: T[]) => T[];
declare type Report<T> = {
    pattern: T[];
    count: number;
};
export declare const patternsOf: <T>(source: T[], min?: number, max?: number) => Report<T>[];
export {};
//# sourceMappingURL=libarray.d.ts.map