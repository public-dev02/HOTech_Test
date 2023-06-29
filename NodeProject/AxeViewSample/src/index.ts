import AxeView from '@/Utility/AxeView/AxeView';
import "@/Styles/Default.scss";

import NavigoProvider from "./Faculty/Router/Providers/Navigo/NavigoProvider";
import GlobalStatic from "./Global/GlobalStatic";
import About from "./Pages/About/About";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Page from "./Pages/Page";
import Admin from "./Pages2/Admin/Admin";
import Page2 from "./Pages2/Page2";
import Shop from "./Pages/Shop/Shop";
import Contact from "./Pages/Contact/Contact";
import Buttons from "./Pages2/Buttons/Buttons";
import Alerts from "./Pages2/Alerts/Alerts";
import Card from "./Pages2/Card/Card";
import Forms from "./Pages2/Forms/Forms";
import Typography from "./Pages2/Typography/Typography";

/**
 * App을 시작하는 함수
 * 라우터 설정 및 첫 로드시 이벤트 등을 관리하는 곳이다.
 */
export default class StartUp
{
    public DomThis: Element;
    public Router: NavigoProvider;

    public AxeView: AxeView;

    constructor()
    {
        this.DomThis = document.querySelector("#root");
        GlobalStatic.app = this;

        this.AxeView = new AxeView();
        this.Router = new NavigoProvider(Page);
        this.ConfigureRoutes();
    }

    /**
     * APP Router를 설정하는 함수
     * @returns {void}
     */
    private ConfigureRoutes(): void
    {
        this.Router
            .on("/", this.Router.ContentRender({
                Page: Page,
                Component: Home
            }))
            .on("/about", this.Router.ContentRender({
                Page: Page,
                Component: About
            }))
            .on("/shop", this.Router.ContentRender({
                Page: Page,
                Component: Shop
            }))
            .on("/contact", this.Router.ContentRender({
                Page: Page,
                Component: Contact
            }))
            .on("/admin", this.Router.ContentRender({
                Page: Page2,
                Component: Admin
            }))
            .on("/admin/buttons", this.Router.ContentRender({
                Page: Page2,
                Component: Buttons
            }))
            .on("/admin/alerts", this.Router.ContentRender({
                Page: Page2,
                Component: Alerts
            }))
            .on("/admin/card", this.Router.ContentRender({
                Page: Page2,
                Component: Card
            }))
            .on("/admin/forms", this.Router.ContentRender({
                Page: Page2,
                Component: Forms
            }))
            .on("/admin/typography", this.Router.ContentRender({
                Page: Page2,
                Component: Typography
            }))
            .notFound(this.Router.ContentRender({
                Page: Page,
                Component: NotFound
            }));

        this.Router.resolve();

        console.log("라우터 설정 완료!");

        /** 모든 a 태그 이벤트를 SPA 성격에 맞게 이벤트를 건다. */
        this.LinkRouteEvent();
    }

    /**
     * 모든 A 태그를 클릭했을 때 기존 이벤트를 제거하고
     * Router의 navigate 메서드로 동작하게 한다.
     */
    private LinkRouteEvent(): void
    {
        this.DomThis.addEventListener("click", (event: MouseEvent) =>
        {
            const target = event.target as Element;
            const targetParent = target.parentElement as Element;
            const href = target.getAttribute("href") || targetParent.getAttribute("href");
            const unset = target.getAttribute("data-unset") || targetParent.getAttribute("data-unset");
            const CurrentUrl = this.Router.getCurrentLocation().url;

            // 만약 data unset이 true라면 원래 a 태그의 기능을 사용한다.
            if (unset === "true")
            {
                return;
            }

            if (target.tagName === "A" || targetParent.tagName === "A")
            {
                // 현재 페이지와 같은 페이지라면 이동하지 않는다.
                if (href === CurrentUrl)
                {
                    return;
                }

                event.preventDefault();
                GlobalStatic.PageNowUrl = href;
                this.Router.navigate(href);
            }
        });
    }
}

/** 시작 */
const app = new StartUp();
