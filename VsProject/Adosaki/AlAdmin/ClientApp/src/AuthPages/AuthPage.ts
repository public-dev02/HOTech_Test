import './AuthPage.scss';
import '@/Styles/FullHeight.scss';

import ResizeObserver from 'resize-observer-polyfill';
import PageComponent from '@/Faculty/Base/PageComponent';
import GlobalStatic from '@/Global/GlobalStatic';

/**
 * Page Component를 생성하는 Class
 */
export default class AuthPage extends PageComponent {
    /** Page Component의 html 파일 주소 */
    private readonly PagePath: string = 'AuthPages/AuthPage.html';

    constructor() {
        /** 베이스가 되는 부모 Class인 PageComponent 상속 */
        super([]);

        /** 로그인 되어있으면 메인 페이지로 이동 */
        if (GlobalStatic.getUserSessionCookie()) {
            GlobalStatic.app.Router.navigate('/dashboard');
            return;
        }

        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
        window.ResizeObserver = ResizeObserver;
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void {
        console.log('페이지 렌더링');
    }
}
