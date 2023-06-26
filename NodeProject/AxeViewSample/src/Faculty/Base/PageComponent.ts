import AsyncHtmlLoader from '@/Utility/AsyncHTMLLoader/async-html-loader';
import Header from '@/Pages/PageLayout/Header/Header';
import Footer from '@/Pages/PageLayout/Footer/Footer';
import GlobalStatic from '@/Global/GlobalStatic';
import HeosabiComponent from './HeosabiComponent';
import ContentComponent from './ContentComponent';

/**
 * Page 들의 부모가 되는 Base Component 이다.
 */
export default class PageComponent extends HeosabiComponent
{
    /** 자식 class의 dom */
    public DomThis: Element;

    /** 헤더 */
    public Header: ContentComponent;
    /** 바디 */
    public Body: HTMLElement;
    /** 푸터 */
    public Footer: ContentComponent;

    /** 비동기로 HTML 파일을 불러오는 라이브러리 */
    public AsyncHtmlLoader: AsyncHtmlLoader = new AsyncHtmlLoader();

    // private PageHeader: new () => ContentComponent;
    // private PageFooter: new () => ContentComponent;

    constructor({ Header, Footer }: { Header: ContentComponent, Footer: ContentComponent; })
    {
        super();

        this.Header = Header;
        this.Footer = Footer;

        // this.PageHeader = Header;
        // this.PageFooter = Footer;
    }

    /**
     * 인자로 html 파일 주소를 받아서
     * html을 로드하고 렌더링을 시작한다.
     * @param {string} HtmlPath 
     */
    protected RenderingStart(HtmlPath: string)
    {
        this.AsyncHtmlLoader.addPath(HtmlPath);
        this.AsyncHtmlLoader.startLoad();

        this.AsyncHtmlLoader.asyncGetHTMLByUrl(HtmlPath, (data) =>
        {
            const sHtml: string = data.htmlString;
            this.DomThis = GlobalStatic.createDOMElement(sHtml);
            this.LayoutRendering();
        });
    }

    /**
     * Header, Body, Footer에 저장 후
     * HTML을 돔에 렌더링하는 함수
     */
    private LayoutRendering(): void
    {
        // this.Header = new this.PageHeader();
        this.Header.DomThisComplete = () =>
        {
            this.DomThis.querySelector("#divHeader").appendChild(this.Header.DomThis);
            this.HeaderCompleteIs = true;
            this.CheckedCompleteContent();
        };
        this.Header.AsyncRenderingStart();

        this.Body = this.DomThis.querySelector('#divBody');

        // this.Footer = new this.PageFooter();
        this.Footer.DomThisComplete = () =>
        {
            this.DomThis.querySelector("#divFooter").appendChild(this.Footer.DomThis);
            this.FooterCompleteIs = true;
            this.CheckedCompleteContent();
        };
        this.Footer.AsyncRenderingStart();
    }

    /** Header Component가 로드가 됬는지 확인하는 boolean 값 */
    private HeaderCompleteIs: boolean = false;
    /** Footer Component가 로드가 됬는지 확인하는 boolean 값 */
    private FooterCompleteIs: boolean = false;

    /**
     * Header와 Footer가 모두 정상적으로 로드가 됬는지 확인 후
     * 렌더링을 완료하는 함수
     * @returns {void}
     */
    private CheckedCompleteContent(): void
    {
        if (false === this.HeaderCompleteIs
            || false === this.FooterCompleteIs)
        {
            return;
        }

        this.DomThisComplete();
        this.RenderingComplete();
    }
}