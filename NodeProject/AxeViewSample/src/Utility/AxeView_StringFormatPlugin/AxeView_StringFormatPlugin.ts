import { Hook, PluginHookList } from "./PluginHookInterface";

export default class AxeView_StringFormatPlugin
{
    private Hooks: PluginHookList;

    constructor()
    {
        this.Hooks = {};
    }

    /**
     * Hook을 추가하는 함수
     * @param {PluginHookList} hook 
     */
    public AddHook(formatGroup: string, hook: Hook): void
    {
        if (undefined === this.Hooks[formatGroup])
        {
            this.Hooks[formatGroup] = {};
        }

        // Hook을 추가한다.
        Object.assign(this.Hooks[formatGroup], hook);

    }

    /**
     * 등록된 Hook을 모두 실행하는 함수
     * @param {any} data 
     * @param {any} options 
     * @returns {string}
     */
    public Use(data: any, options: any): string
    {
        let sReturn = data;

        // formatGroup이 있는 경우
        if (undefined !== options["formatGroup"])
        {
            // formatGroup을 "|"를 기준으로 배열로 만든다.
            const formatGroup: string[] = options["formatGroup"].slice(1, -1).split("|");

            // formatGroup을 순회하면서 Hook을 실행한다.
            for (const format of formatGroup)
            {
                if (undefined !== this.Hooks[format])
                {
                    // 해당 formatGroup이 존재한다면
                    for (const key in this.Hooks[format])
                    {

                        // 해당 key의 Hook이 존재하고 options에 해당 key가 true인 경우
                        if (undefined !== this.Hooks[format][key] && "true" === options[key])
                        {
                            // Hook을 실행한다.
                            sReturn = this.Hooks[format][key](sReturn, options);
                        }
                    }
                }
            }
        }

        return sReturn;

    }

}
