import GlobalStatic from "@/Global/GlobalStatic";
import AsyncHtmlLoader from "@/Utility/AsyncHTMLLoader/async-html-loader";
import { NavigateMatchModel } from "../Router/Models/NavigateMatchModel";
import { Overwatch } from "@/Utility/AxeView/Overwatch";
import { OverwatchInterface } from "@/Utility/AxeView/OverwatchInterface";
import { OverwatchingOutputType, OverwatchingType } from "@/Utility/AxeView/OverwatchingType";
import PrintInferredTypes from "@/Utility/PrintInferredTypes/PrintInferredTypes";

interface ChildComponentInterface
{
    overwatchName: string;
    component: new () => HeosabiComponent;
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
    /** 나의 오버워치 객체 */
    public OverwatchThis: Overwatch;
    /** Json의 타입을 추론하여 완성된 Json 객체를 만들어주는 class */
    private JsonInferredTypes: PrintInferredTypes = new PrintInferredTypes();

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

            // AxeView를 바인드한다.
            GlobalStatic.app.AxeView.BindOverwatch(this.DomThis, this.AxeList);

            this.DomThisComplete();
            this.RenderingComplete();

            // 컴포넌트가 존재한다면
            if (this.ChildComponents.length > 0)
            {
                // AxeView를 바인드한 후 컴포넌트를 등록한다.
                this.InitializeChildComponents();
                console.log("컴포넌트 렌더링");
            }
        });
    }

    /**
     * 나에게 정의된 옵션을 가져오는 함수
     * @returns {T}
     */
    protected GetOptions<T>(): T
    {
        const options: T = this.OverwatchThis.TossOptionFirst<T>();
        const InferredOptions: T = this.JsonInferredTypes.Parse<T>(options);

        return InferredOptions;
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * 자식 Class에서 함수를 Overriding 해서 사용한다.
     * @returns {void}
     */
    protected RenderingComplete(): void
    {
        console.log("Rendering Completed!");
    }

    /**
     * 해당 Class를 상속받는 자식 Component들이
     * 성공적으로 Dom이 생성된 후 실행하는 콜백 함수
     * 기본적으로 정의되지 않은 함수이고
     * 자식 Class에서 함수를 Overriding해서 사용한다.
     * @returns {void}
     */
    public DomThisComplete(): void { }

    //#region 액스뷰 리스트 처리
    public AxeList: Array<Overwatch> = new Array<Overwatch>();

    protected UseOverwatchAll({
        Name,
        FirstData,
        OverwatchingOutputType,
        OverwatchingType,
        OverwatchingOneIs,
        AxeDomSet_DataEdit,
    }: OverwatchInterface): void
    {
        const model: Overwatch = new Overwatch({
            Name,
            FirstData,
            OverwatchingOutputType,
            OverwatchingType,
            OverwatchingOneIs,
            AxeDomSet_DataEdit,
        });

        this.AxeList.push(model);
    }

    protected UseOverwatchOutputString(sName: string, FirstData: string): void
    {
        const model: Overwatch =
            GlobalStatic.app.AxeView.New_OutputString(sName, FirstData);

        this.AxeList.push(model);
    }

    protected UseOverwatchMonitoringString(sName: string, FirstData: string): void
    {
        const model: Overwatch =
            GlobalStatic.app.AxeView.New_MonitoringString(sName, FirstData);

        this.AxeList.push(model);
    };

    protected UseOverwatchComponent(sName: string, FirstDom?: HTMLElement): void
    {
        this.UseOverwatchAll({
            Name: sName,
            FirstData: FirstDom ?? document.createElement("div"),
            OverwatchingOutputType: OverwatchingOutputType.Dom,
            OverwatchingType: OverwatchingType.OutputFirst,
            OverwatchingOneIs: false,
        });
    }

    protected AxeSelectorByName(sName: string): Overwatch | undefined
    {
        const findOverwatch: Overwatch | undefined = this.AxeList.find(
            (overwatch: Overwatch) => overwatch.Name === sName
        );

        if (undefined === findOverwatch)
        {
            console.log(`AxeSelector Error: ${sName} is not found!`);
        }

        return findOverwatch;
    }

    protected AxeSelectorById(sId: string): Overwatch | undefined
    {
        // OverwatchType이 Dom 일 경우에 사용할 수 있고 Dom이 아닐 경우에는 에러를 발생시킨다.
        const findOverwatch: Overwatch | undefined = this.AxeList.find(
            (overwatch: Overwatch) => overwatch.data.id === sId
        );

        if (undefined === findOverwatch)
        {
            throw new Error(`AxeView Error: ${sId} is not found.`);
        }

        return findOverwatch;
    }
    // //#endregion

    //#region 컴포넌트 레이아웃 처리
    public ChildComponents: ChildComponentInterface[] = [];

    protected AddChildComponent(components: ChildComponentInterface[]): void
    {
        this.ChildComponents.push(...components);
    }

    private InitializeChildComponents(): void
    {
        // 슬립 함수
        // const sleep = (ms: number) => {
        //     return new Promise((resolve) => setTimeout(resolve, ms));
        // };

        this.ChildComponents.forEach((child) =>
        {
            const component: HeosabiComponent = new child.component();
            const overwatch: Overwatch = this.AxeList.find(
                (axe) => axe.Name === child.overwatchName
            );

            component.OverwatchThis = overwatch;

            component.DomThisComplete = () =>
            {
                const componentDomThis: HTMLElement = component.DomThis;
                console.log(overwatch);
                overwatch.data = componentDomThis;
            };
        });
    }
    //#endregion
}
