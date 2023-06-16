import AsyncHtmlLoader from '@/Utility/AsyncHTMLLoader/async-html-loader';
import Header from '@/Pages/PageLayout/Header/Header';
import Footer from '@/Pages/PageLayout/Footer/Footer';
import GlobalStatic from '@/Global/GlobalStatic';
import HeosabiComponent from './HeosabiComponent';

export default class PageComponent extends HeosabiComponent
{
    /** 자식 class의 dom */
    public DomThis: Element;

    /** 헤더 */
    public Header: Header;
    /** 바디 */
    public Body: HTMLElement;
    /** 푸터 */
    public Footer: Footer;

    /** 비동기로 HTML 파일을 불러오는 라이브러리 */
    public AsyncHtmlLoader: AsyncHtmlLoader = new AsyncHtmlLoader();

    constructor()
    {
        super();
    }

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
        this.Header = new Header();
        this.Header.DomThisComplete = () =>
        {
            this.DomThis.querySelector("#divHeader").appendChild(this.Header.DomThis);
            this.HeaderCompleteIs = true;
            this.CheckedCompleteContent();
        };

        this.Body = this.DomThis.querySelector('#divBody');

        this.Footer = new Footer();
        this.Footer.DomThisComplete = () =>
        {
            this.DomThis.querySelector("#divFooter").appendChild(this.Footer.DomThis);
            this.FooterCompleteIs = true;
            this.CheckedCompleteContent();
        };
    }

    private HeaderCompleteIs: boolean = false;
    private FooterCompleteIs: boolean = false;

    private CheckedCompleteContent()
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