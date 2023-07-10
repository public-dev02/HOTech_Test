export interface PluginHookList
{
    [key: string]: Hook;
}

/** formatGroup 적용 대비 */
export type Hook = {
    [key: string]: (data: any, options: any) => string;
};