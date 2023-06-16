import { Match } from 'navigo';
import GlobalStatic from "@/Global/GlobalStatic";
import AsyncHtmlLoader from "@/Utility/AsyncHTMLLoader/async-html-loader";
import { NavigateMatchModel } from '../Router/NavigateMatchModel';

/**
 * 모든 Component의 부모가 되는 Component이다.
 */
export default class HeosabiComponent
{
    /** 자식 class의 dom */
    public DomThis: Element;
    /** 비동기로 HTML 파일을 불러오는 라이브러리 */
    public AsyncHtmlLoader: AsyncHtmlLoader = new AsyncHtmlLoader();
    /** 컴포넌트가 보여지고 있는 현재 Route 정보들 */
    public RouteThis: NavigateMatchModel;

    constructor() { }

    /**
     * constructor에 전달받은 HtmlPath를 통해서 비동기로 HTML을 다운로드 하는 함수
     * @param {string} HtmlPath
     */
    protected RenderingStart(HtmlPath: string): void
    {
        this.AsyncHtmlLoader.addPath(HtmlPath);
        this.AsyncHtmlLoader.startLoad();

        this.AsyncHtmlLoader.asyncGetHTMLByUrl(HtmlPath, (data) =>
        {
            const sHtml: string = data.htmlString;
            this.DomThis = GlobalStatic.createDOMElement(sHtml);

            this.DomThisComplete();
            this.RenderingComplete();
        });
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * 자식 Class에서 함수를 Overriding 해서 사용한다.
     * @returns {void}
     */
    protected RenderingComplete(): void
    {
        console.log('Rendering Completed!');
    }

    /**
     * 해당 Class를 상속받는 자식 Component들이
     * 성공적으로 Dom이 생성된 후 실행하는 콜백 함수
     * 기본적으로 정의되지 않은 함수이고
     * 자식 Class에서 함수를 Overriding해서 사용한다.
     * @returns {void | null}
     */
    public DomThisComplete: () => void | null;
}