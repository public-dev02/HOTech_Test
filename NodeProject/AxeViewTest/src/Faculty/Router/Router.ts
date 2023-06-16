import Navigo, { Match } from "navigo";
import HeosabiComponent from "../Base/HeosabiComponent";
import GlobalStatic from "@/Global/GlobalStatic";

/**
 * Router를 관리하고 등록할 수 있는 Class이다.
 * @extends {Navigo} Navigo 라이브러리의 도움을 받아 작성
 */
export default class Router extends Navigo
{
    constructor()
    {
        super("/");
    }

    /**
     * Route를 등록할 때 사용하는 함수이다.
     * @example this.Router.on(this.Router.Render(Component))
     * @return {(match: Match) => void}
     */
    public Render<T extends HeosabiComponent>(Component: new () => T): (match: Match) => void
    {
        return (match: Match) =>
        {
            GlobalStatic.PageLayout.Body.innerHTML = "";
            GlobalStatic.PageNow = new Component();
            console.log(GlobalStatic.PageNow);

            GlobalStatic.PageNow.DomThisComplete = () =>
            {
                GlobalStatic.PageLayout.Body.appendChild(GlobalStatic.PageNow.DomThis);
                GlobalStatic.PageNow.RouteThis = match;
            };
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