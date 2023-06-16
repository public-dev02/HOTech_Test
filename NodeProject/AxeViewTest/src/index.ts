import Router from "./Faculty/Router/Router";
import GlobalStatic from "./Global/GlobalStatic";
import About from "./Pages/About/About";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Page from "./Pages/Page";

export default class StartUp
{
    public DomThis: Element;
    public Router: Router;

    constructor()
    {
        this.Router = new Router();

        this.DomThis = document.querySelector("#root");
        GlobalStatic.app = this;

        GlobalStatic.PageLayout = new Page();
        console.log(GlobalStatic.PageLayout);

        GlobalStatic.PageLayout.DomThisComplete = () =>
        {
            this.ConfigureRoutes();
            this.DomThis.appendChild(GlobalStatic.PageLayout.DomThis);
        };
    }

    private ConfigureRoutes()
    {
        this.Router
            .on("/", this.Router.Render(Home))
            .on("/about", this.Router.Render(About))
            .on("/about/:id", this.Router.Render(About))
            .notFound(this.Router.Render(NotFound))
            .resolve();

        this.LinkRouteEvent();
    };

    private LinkRouteEvent()
    {
        this.DomThis.addEventListener('click', (event: MouseEvent) =>
        {
            const target = event.target as Element;
            if (target.tagName === "A")
            {
                event.preventDefault();
                const href = target.getAttribute('href');

                this.Router.PreviousRoute = window.location.pathname;

                this.Router.navigate(href);
            }
        });
    };
};

const app = new StartUp();