import Navigo, { Match } from "navigo";
import HeosabiComponent from "../Base/HeosabiComponent";
import GlobalStatic from "@/Global/GlobalStatic";
import NotFound from "@/Pages/NotFound/NotFound";

export default class Router extends Navigo
{
    public PreviousRoute: string;

    constructor()
    {
        super("/");
    }

    public Render<T extends HeosabiComponent>(Component: new () => T)
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

    public Rewrite(url: string)
    {
        window.history.replaceState({}, '', url);
    }
}