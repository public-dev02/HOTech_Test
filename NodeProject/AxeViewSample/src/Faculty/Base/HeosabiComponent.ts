import { Match } from 'navigo';
import GlobalStatic from "@/Global/GlobalStatic";
import AsyncHtmlLoader from "@/Utility/AsyncHTMLLoader/async-html-loader";
import { NavigateMatchModel } from '../Router/Models/NavigateMatchModel';
import { Overwatch } from '@/Utility/AxeView/Overwatch';
import { OverwatchInterface } from '@/Utility/AxeView/OverwatchInterface';

interface ChildComponentInterface
{
    overwatchName: string;
    component: HeosabiComponent;
}

/**
 * 모든 Component의 부모가 되는 Component이다.
 */
export default class HeosabiComponent
{
    /** 자식 class의 dom */
    public DomThis: HTMLElement;
    /** 비동기로 HTML 파일을 불러오는 라이브러리 */
    public AsyncHtmlLoader: AsyncHtmlLoader = new AsyncHtmlLoader();
    /** 컴포넌트가 보여지고 있는 현재 Route 정보들 */
    public RouteThis: NavigateMatchModel;

    // public OnAxe: function = (objThis) => { };
    // public OnAxeBC: function = (objThis) => { };

    constructor() { }

    /**
     * constructor에 전달받은 HtmlPath를 통해서 비동기로 HTML을 다운로드 하는 함수
     * @param {string} HtmlPath
     */
    protected RenderingStart(HtmlPath: string): void
    {
        // this.AxeList = AxeList;

        this.AsyncHtmlLoader.addPath(HtmlPath);
        this.AsyncHtmlLoader.startLoad();

        // con1.OnAxe = (objThis) => { this.AxeList.push(objThis.AxeList); };
        // con1.OnAxeBC = (objThis) => { };

        // this.OnAxe(this);

        this.AsyncHtmlLoader.asyncGetHTMLByUrl(HtmlPath, (data) =>
        {
            const sHtml: string = data.htmlString;

            this.DomThis = GlobalStatic.createDOMElement(sHtml);

            // 컴포넌트가 존재한다면
            if (this.ChildComponents.length > 0)
            {
                // AxeView를 바인드하기 전에 컴포넌트를 등록한다.
                this.InitializeChildComponents();
            }

            GlobalStatic.app.AxeView.BindOverwatch(this.DomThis, this.AxeList);

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
     * @returns {void}
     */
    public DomThisComplete(): void { }

    //#region 컴포넌트 레이아웃 처리
    public ChildComponents: ChildComponentInterface[] = [];

    protected AddChildComponent(components: ChildComponentInterface[]): void
    {
        this.ChildComponents.push(...components);
    }

    private InitializeChildComponents(): void
    {
        this.ChildComponents.forEach((child) =>
        {
            const outerHtml: string = child.component.AsyncHtmlLoader.getHTML[0].htmlString;
            const overwatch: Overwatch = this.AxeList.find((axe) => axe.Name === child.overwatchName);

            overwatch.data = outerHtml;
        });
    }
    //#endregion

    //#region 액스뷰 리스트 처리
    public AxeList: Array<Overwatch> = new Array<Overwatch>();

    protected UseOverwatch({
        Name,
        FirstData,
        OverwatchingOutputType,
        OverwatchingType,
        OverwatchingOneIs
    }: OverwatchInterface): void
    {
        const model: Overwatch = new Overwatch({
            Name,
            FirstData,
            OverwatchingOutputType,
            OverwatchingType,
            OverwatchingOneIs
        });

        this.AxeList.push(model);
    }

    protected AxeSelectorByName(sName: string): Overwatch | undefined
    {
        const findOverwatch: Overwatch | undefined =
            this.AxeList.find((overwatch: Overwatch) => overwatch.Name === sName);

        if (undefined === findOverwatch)
        {
            console.log(`AxeSelector Error: ${sName} is not found!`);
        }

        return findOverwatch;
    }
    // //#endregion
}