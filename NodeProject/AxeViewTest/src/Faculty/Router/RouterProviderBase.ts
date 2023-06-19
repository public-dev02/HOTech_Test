import ContentComponent from "@/Faculty/Base/ContentComponent";

import HeosabiComponent from "@/Faculty/Base/HeosabiComponent";
import { NavigateMatchModel, NavigateMatchDataModel } from "@/Faculty/Router/Models/NavigateMatchModel";

import GlobalStatic from "@/Global/GlobalStatic";

/** 라우터가 구현해야할 원형 */
export default class RouterProviderBase
{

    constructor()
    {

    }

    public ContentRender<T extends HeosabiComponent>(Component: new () => T)
    {
        return (match: NavigateMatchModel) =>
        {
            if (null === GlobalStatic.PageNow
                || GlobalStatic.PageNow.constructor.name !== Component.name)
            {
                GlobalStatic.PageLayout.Body.innerHTML = "";
                GlobalStatic.PageNow = new Component();

                GlobalStatic.PageNow.DomThisComplete = () =>
                {
                    GlobalStatic.PageLayout.Body.appendChild(GlobalStatic.PageNow.DomThis);
                    GlobalStatic.PageNow.RouteThis = match;
                    console.log(GlobalStatic.PageNow);
                };
            }

        };
    }

    /**
     * 현재 주소창의 url을 변경해주는 함수이다.
     * redirect와는 다른 개념으로 url만 변경하고 화면은 다시 그리지 않는다.
     * @param {string} url 
     * @returns {void}
     */
    public Rewrite(url: string): void
    {
        window.history.replaceState({}, '', url);
    }
}