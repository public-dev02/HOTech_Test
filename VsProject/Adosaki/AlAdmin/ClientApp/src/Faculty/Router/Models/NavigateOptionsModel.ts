import { ResolveOptions } from "./NavigateResolveModel";

export interface NavigateOptions
{
    title?: string;
    stateObj?: Object;
    historyAPIMethod?: string;
    updateBrowserURL?: boolean;
    callHandler?: boolean;
    callHooks?: boolean;
    updateState?: boolean;
    force?: boolean;
    resolveOptions?: ResolveOptions;
};