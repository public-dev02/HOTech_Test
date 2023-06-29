import AsyncHtmlLoader from '@/Utility/AsyncHTMLLoader/async-html-loader';
import GlobalStatic from '@/Global/GlobalStatic';
import HeosabiComponent from './HeosabiComponent';
import ContentComponent from './ContentComponent';

interface LayoutComponent { position: string; component: ContentComponent; }

/**
 * Page 들의 부모가 되는 Base Component 이다.
 */
export default class PageComponent extends HeosabiComponent
{
    /** 자식 class의 dom */
    public DomThis: HTMLElement;

    /** 바디 */
    public Body: HTMLElement | null = null;
    public LayoutComponents: LayoutComponent[] = [];

    /** 비동기로 HTML 파일을 불러오는 라이브러리 */
    public AsyncHtmlLoader: AsyncHtmlLoader = new AsyncHtmlLoader();

    constructor(components?: LayoutComponent[])
    {
        super();

        if (undefined === components)
        {
            // components가 undefined인 경우 빈 배열로 초기화한다.
            components = [];
        }

        this.LayoutComponents = components;

        // this.Header = Header;
        // this.Footer = Footer;
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

    private OnlyBodyLayoutRendering(): void
    {
        // 바디를 찾아서 등록한다.
        this.Body = this.DomThis.querySelector('#divBody');
        this.LayoutRenderingComplete();
    }

    /**
     * Header, Body, Footer에 저장 후
     * HTML을 돔에 렌더링하는 함수
     */
    private LayoutRendering(): void
    {
        // 등록된 레이아웃 컴포넌트가 없으면 바디만 렌더링한다.
        if (0 === this.LayoutComponents.length)
        {
            this.OnlyBodyLayoutRendering();
        }

        // 등록된 레이아웃 컴포넌트 갯수
        const ComponentsToLoad = this.LayoutComponents.length;
        // 로드된 레이아웃 컴포넌트 갯수
        let loadedComponents = 0;

        // 레이아웃 컴포넌트가 모두 로드됬는지 계속 확인하는 함수
        const CheckCompletion = () =>
        {
            // 로드된 컴포넌트 갯수를 증가시킨다
            loadedComponents++;
            if (loadedComponents === ComponentsToLoad)
            {
                // 로드된 컴포넌트 갯수와 등록된 컴포넌트 갯수가 같으면
                // 모든 레이아웃이 로그가 된 것이므로 렌더링을 완료한다.
                this.LayoutRenderingComplete();
            }
        };

        // 바디를 찾아서 등록한다.
        this.Body = this.DomThis.querySelector('#divBody');

        this.LayoutComponents.forEach((componentData) =>
        {
            // 컴포넌트 데이터 구조분해 할당
            const { position, component } = componentData;
            // 해당 컴포넌트를 로드할 위치를 찾는다.
            const TargetElement = this.DomThis.querySelector(`#${position}`);

            // 컴포넌트가 성공적으로 로드됬을 때 함수를 등록한다.
            component.DomThisComplete = () =>
            {
                // 컴포넌트를 해당 위치에 추가한다.
                TargetElement.appendChild(component.DomThis);
                // 컴포넌트가 로드됬음을 표시한다.
                component.IsComplete = true;
                // 컴포넌트가 모두 로드됬는지 확인한다.
                CheckCompletion();
            };

            // 컴포넌트를 렌더링한다.
            component.AsyncRenderingStart();
        });
    }

    /**
     * 모든 레이아웃이 로드를 성공한 후 실행되는 함수
     */
    private LayoutRenderingComplete(): void
    {
        this.DomThisComplete();
        this.RenderingComplete();
    }
}
