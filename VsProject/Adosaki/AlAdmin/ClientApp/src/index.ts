import NavigoProvider from '@/Faculty/Router/Providers/Navigo/NavigoProvider';
import AxeView from '@/Utility/AxeView/AxeView';
import GlobalStatic from '@/Global/GlobalStatic';

import Page from '@/Pages/Page';

import AuthPage from './AuthPages/AuthPage';
import Login from './AuthPages/Login/Login';
import Register from './AuthPages/Register/Register';
import Admin from './Pages/Admin/Admin';

export default class StartUp {
    public DomThis: Element;
    public Router: NavigoProvider;

    public AxeView: AxeView;

    constructor() {
        this.DomThis = document.querySelector('#root');
        GlobalStatic.app = this;

        this.AxeView = new AxeView();
        this.Router = new NavigoProvider(Page);

        this.ConfigureRoutes();
    }

    /**
     * APP Router를 설정하는 함수
     * @returns {void}
     */
    private ConfigureRoutes(): void {
        this.Router.on(
            '/',
            this.Router.ContentRender({
                Page: AuthPage,
                Component: Login,
            })
        )
            .on(
                '/register',
                this.Router.ContentRender({
                    Page: AuthPage,
                    Component: Register,
                })
            )
            .on(
                '/admin',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Admin,
                })
            );

        this.Router.resolve();

        /** 모든 a 태그 이벤트를 SPA 성격에 맞게 이벤트를 건다. */
        this.LinkRouteEvent();
    }

    /**
     * 모든 A 태그를 클릭했을 때 기존 이벤트를 제거하고
     * Router의 navigate 메서드로 동작하게 한다.
     */
    private LinkRouteEvent(): void {
        this.DomThis.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as Element;
            const targetParent = target.parentElement as Element;
            const href =
                target.getAttribute('href') ||
                targetParent.getAttribute('href');
            const unset =
                target.getAttribute('data-unset') ||
                targetParent.getAttribute('data-unset');
            const CurrentUrl = this.Router.getCurrentLocation().url;

            // 만약 data unset이 true라면 원래 a 태그의 기능을 사용한다.
            if (unset === 'true') {
                return;
            }

            if (target.tagName === 'A' || targetParent.tagName === 'A') {
                // 현재 페이지와 같은 페이지라면 이동하지 않는다.
                if (href === CurrentUrl) {
                    return;
                }

                event.preventDefault();
                GlobalStatic.PageNowUrl = href;
                this.Router.navigate(href);
            }
        });
    }
}

/** start */
const app = new StartUp();
