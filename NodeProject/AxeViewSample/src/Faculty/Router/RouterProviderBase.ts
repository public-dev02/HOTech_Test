import HeosabiComponent from "@/Faculty/Base/HeosabiComponent";
import { NavigateMatchModel, NavigateMatchDataModel } from "@/Faculty/Router/Models/NavigateMatchModel";

import GlobalStatic from "@/Global/GlobalStatic";
import PageComponent from "../Base/PageComponent";

/** 라우터가 구현해야할 원형 */
export default class RouterProviderBase
{
    private DefaultPage: new () => PageComponent;
    private CurrentPageDom: Element | null = null;

    constructor(defaultPage: new () => PageComponent)
    {
        this.DefaultPage = defaultPage;
    }

    public ContentRender<T extends HeosabiComponent>({ Page, Component }: {
        Page?: new () => PageComponent
        , Component: new () => T;
    })
    {
        if (undefined === Page)
        {
            // 지정된 Page가 없는 경우 Default Page로 설정한다.
            Page = this.DefaultPage;
        }

        return (match: NavigateMatchModel) =>
        {
            if (null === GlobalStatic.PageLayout || GlobalStatic.PageLayout.constructor.name !== Page.name)
            {
                // Page Layout이 없거나, Page Layout이 다른 경우
                GlobalStatic.PageLayout = new Page();

                GlobalStatic.PageLayout.DomThisComplete = () =>
                {
                    GlobalStatic.app.DomThis.innerHTML = "";
                    GlobalStatic.app.DomThis.appendChild(GlobalStatic.PageLayout.DomThis);
                    // GlobalStatic.app.Router.resolve();

                    this.CreatePage(Component, match);
                };
            }
            else
            {
                // Page Layout이 있고, Page Layout이 같은 경우
                this.CreatePage(Component, match);
            }

        };
    }

    private CreatePage<T extends HeosabiComponent>(Component: new () => T, match: NavigateMatchModel)
    {
        if (null === GlobalStatic.PageNow
            || GlobalStatic.PageNow.constructor.name !== Component.name)
        {
            if (null === GlobalStatic.PageLayout) 
            {
                return;
            }

            GlobalStatic.PageNow = new Component();

            GlobalStatic.PageNow.DomThisComplete = () =>
            {
                if (null == this.CurrentPageDom)
                {
                    GlobalStatic.PageLayout.Body.appendChild(GlobalStatic.PageNow.DomThis);
                }
                else
                {
                    console.log(GlobalStatic.PageNow.DomThis, this.CurrentPageDom);
                    GlobalStatic.PageLayout.Body.replaceChild(GlobalStatic.PageNow.DomThis, this.CurrentPageDom);
                }
                // GlobalStatic.PageLayout.Body.replaceChild(GlobalStatic.PageNow.DomThis, this.CurrentPageDom!);
                GlobalStatic.PageNow.RouteThis = match;
                this.CurrentPageDom = GlobalStatic.PageNow.DomThis;
            };
        }
    };

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