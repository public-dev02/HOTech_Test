import Navigo, { Match } from "navigo";
import HeosabiComponent from "../Base/HeosabiComponent";
import GlobalStatic from "@/Global/GlobalStatic";
import NotFound from "@/Pages/NotFound/NotFound";

export default class Router extends Navigo
{
    constructor()
    {
        super("/");
    }

    public Render<T extends HeosabiComponent>(Component: new () => T)
    {
        return (match: Match) =>
        {
            console.log(match);
            GlobalStatic.PageLayout.Body.innerHTML = "";
            GlobalStatic.PageNow = new Component();

            GlobalStatic.PageNow.DomThisComplete = () =>
            {
                GlobalStatic.PageLayout.Body.appendChild(GlobalStatic.PageNow.DomThis);
                GlobalStatic.PageNow.RouteThis = match;
                console.log(GlobalStatic.PageNow);
            };
        };
    }

    public NotFound(match: Match)
    {
        GlobalStatic.PageLayout.Body.innerHTML = "";
        GlobalStatic.PageNow = new NotFound();

        GlobalStatic.PageNow.DomThisComplete = () =>
        {
            GlobalStatic.PageLayout.Body.appendChild(GlobalStatic.PageNow.DomThis);
            GlobalStatic.PageNow.RouteThis = match;
            console.log(GlobalStatic.PageNow);
        };
    }
}