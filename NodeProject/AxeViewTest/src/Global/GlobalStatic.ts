import ContentComponent from "@/Faculty/Base/ContentComponent";
import StartUp from "@/index";
import Page from "@/Pages/Page";

//사이트 공통
import AxeView from "@/Utility/AxeView/AxeView";

/** 전역 변수 */
export default class GlobalStatic
{

    static
    {
    }

    /** 프로젝트 제목 */
    static Title: string = "Axe view";

    /** 개발 모드 여부 */
    static DevMode: boolean = false;


    //전역 유틸
    /** 엑스뷰*/
    static AxeView: AxeView = new AxeView();

    /** 이 응용프로그램*/
    static app: StartUp | null;
    /** 사용중인 페이지 개체*/
    static PageLayout: Page | null;
    /** 지금 보고 있는 페이지 개체*/
    static PageNow: ContentComponent | null;

    /**
     * html 문자열을 인자로 받아서
     * DOM으로 생성해서 Return 해주는 함수이다.
     * @param {string} sHtml 
     * @returns {Element}
     */
    static createDOMElement(sHtml: string): Element
    {
        const Template = document.createElement('template');
        Template.innerHTML = sHtml;

        return Template.content.children[0];
    }
}
