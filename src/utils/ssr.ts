/* Copyright (c) 2026 eele14. All Rights Reserved. */
/** True when the module is loaded outside of a browser environment */
export const isSSR: boolean = typeof window === "undefined";
