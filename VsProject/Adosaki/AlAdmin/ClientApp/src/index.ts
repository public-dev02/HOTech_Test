import NavigoProvider from '@/Faculty/Router/Providers/Navigo/NavigoProvider';
import AxeView from '@/Utility/AxeView/AxeView';
import GlobalStatic from '@/Global/GlobalStatic';

import Page from '@/Pages/Page';

import AuthPage from './AuthPages/AuthPage';
import Login from './AuthPages/Login/Login';
import Register from './AuthPages/Register/Register';
import DashBoard from './Pages/DashBoard/DashBoard';
import NotFound from './Pages/NotFound/NotFound';
import UserList from './Pages/List/UserList/UserList';
import UserListInStore from './Pages/Store/UserList/UserList';
import StoreList from './Pages/List/StoreList/StoreList';
import StoreInfo from './Pages/Store/StoreInfo/StoreInfo';
import Charge from './Pages/Cash/Charge/Charge';
import Exchange from './Pages/Cash/Exchange/Exchange';
import Results from './Pages/Game/Results/Results';
import LiveBettings from './Pages/Game/LiveBettings/LiveBettings';
import Bettings from './Pages/Game/Bettings/Bettings';
import Notice from './Pages/Site/Notice/Notice';
import Question from './Pages/Site/Question/Question';
import QuestionList from './Pages/Site/QuestionList/QuestionList';

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
                '/dashboard',
                this.Router.ContentRender({
                    Page: Page,
                    Component: DashBoard,
                })
            )
            .on(
                '/list/store',
                this.Router.ContentRender({
                    Page: Page,
                    Component: StoreList,
                })
            )
            .on(
                '/list/users',
                this.Router.ContentRender({
                    Page: Page,
                    Component: UserList,
                })
            )
            .on(
                '/store/info',
                this.Router.ContentRender({
                    Page: Page,
                    Component: StoreInfo,
                })
            )
            .on(
                '/store/users',
                this.Router.ContentRender({
                    Page: Page,
                    Component: UserListInStore,
                })
            )
            .on(
                '/cash/charge',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Charge,
                })
            )
            .on(
                '/cash/exchange',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Exchange,
                })
            )
            .on(
                '/game/results',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Results,
                })
            )
            .on(
                '/game/livebettings',
                this.Router.ContentRender({
                    Page: Page,
                    Component: LiveBettings,
                })
            )
            .on(
                '/game/bettings',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Bettings,
                })
            )
            .on(
                '/site/notice',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Notice,
                })
            )
            .on(
                '/site/question',
                this.Router.ContentRender({
                    Page: Page,
                    Component: Question,
                })
            )
            .on(
                '/site/questionlist',
                this.Router.ContentRender({
                    Page: Page,
                    Component: QuestionList,
                })
            )
            .notFound(
                this.Router.ContentRender({
                    Page: Page,
                    Component: NotFound,
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
