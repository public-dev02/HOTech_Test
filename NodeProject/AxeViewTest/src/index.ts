import NavigoProvider from "./Faculty/Router/NavigoProvider";
import GlobalStatic from "./Global/GlobalStatic";
import About from "./Pages/About/About";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Page from "./Pages/Page";

/**
 * App을 시작하는 함수
 * 라우터 설정 및 첫 로드시 이벤트 등을 관리하는 곳이다.
 */
export default class StartUp
{
    public DomThis: Element;
    public Router: NavigoProvider;

    constructor()
    {
        this.Router = new NavigoProvider();

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

    /**
     * APP Router를 설정하는 함수
     * @returns {void}
     */
    private ConfigureRoutes(): void
    {
        this.Router
            .on("/", this.Router.ContentRender(Home))
            .on("/about", this.Router.ContentRender(About))
            .on("/about/:id", this.Router.ContentRender(About))
            .notFound(this.Router.ContentRender(NotFound))
            .resolve();

        /** 모든 a 태그 이벤트를 SPA 성격에 맞게 이벤트를 건다. */
        this.LinkRouteEvent();
    };

    /**
     * 모든 A 태그를 클릭했을 때 기존 이벤트를 제거하고
     * Router의 navigate 메서드로 동작하게 한다.
     */
    private LinkRouteEvent(): void
    {
        this.DomThis.addEventListener('click', (event: MouseEvent) =>
        {
            const target = event.target as Element;
            if (target.tagName === "A")
            {
                event.preventDefault();
                const href = target.getAttribute('href');

                this.Router.navigate(href);
            }
        });
    };
};

/** 시작 */
const app = new StartUp();