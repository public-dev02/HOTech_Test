import { Match } from 'navigo';
import GlobalStatic from "@/Global/GlobalStatic";
import AsyncHtmlLoader from "@/Utility/AsyncHTMLLoader/async-html-loader";

export default class HeosabiComponent
{
    /** 자식 class의 dom */
    public DomThis: Element;
    public AsyncHtmlLoader: AsyncHtmlLoader = new AsyncHtmlLoader();
    public RouteThis: Match;

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
     */
    protected RenderingComplete(): void
    {
        console.log('Rendering Completed!');
    }

    public DomThisComplete: () => void | null;
}