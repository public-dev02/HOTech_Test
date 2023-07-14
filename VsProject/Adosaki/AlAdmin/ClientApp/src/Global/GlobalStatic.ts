import HeosabiComponent from '@/Faculty/Base/HeosabiComponent';
import PageComponent from '@/Faculty/Base/PageComponent';
import StartUp from '@/index';
import Cookies from 'js-cookie';

/** 전역 변수 */
export default class GlobalStatic {
    /** 전역 변수 */

    /** root */
    static app: StartUp | null = null;
    /** 사용중인 페이지 개체 */
    static PageLayout: PageComponent | null = null;
    /** 지금 보고 있는 페이지 개체 */
    static PageNow: HeosabiComponent | null = null;
    /** 지금 보고 있는 페이지 주소 */
    static PageNowUrl: string = '';

    /** 유저 데이터 쿠키 이름 */
    static UserSessionCookieName: string = 'USER_SESSION';
    /** 로그인한 유저 정보 */
    static User: any = null;

    /** 전역 함수 */

    static getUserSessionCookie(): string {
        return Cookies.get(GlobalStatic.UserSessionCookieName) || '';
    }

    static setUserInfo(user: { name: string; id: string; password: string }) {
        GlobalStatic.User = user;
    }

    /**
     * html 문자열을 인자로 받아서
     * DOM으로 생성해서 Return 해주는 함수이다.
     * @param {string} sHtml
     * @returns {Element}
     */
    static createDOMElement(sHtml: string): HTMLElement {
        const Template = document.createElement('template');
        Template.innerHTML = sHtml;

        return Template.content.children[0] as HTMLElement;
    }
}
