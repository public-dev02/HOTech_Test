import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Home.scss";
import { OverwatchingOutputType, OverwatchingType } from "@/Utility/AxeView/OverwatchingType";
import { Overwatch } from "@/Utility/AxeView/Overwatch";
import Card from "../Components/Card/Card";
import Button from "../Components/Button/Button";
import Form from "../Components/Form/Form";
import AxeView_StringFormatPlugin from "@/Utility/AxeView_StringFormatPlugin/AxeView_StringFormatPlugin";
import { AxeViewDomInterface } from "@/Utility/AxeView/AxeViewDomInterface";

/**
 * Home Component를 생성하는 Class
 * Index가 되는 페이지이다.
 */
export default class Home extends ContentComponent
{
    /** Home Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages/Home/Home.html";
    private StringFormatPlugin: AxeView_StringFormatPlugin;

    constructor()
    {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        this.AddOverwatchState();
        /** this.PagePath를 통해서 렌더링 시작 */
        this.AddChildComponent([
            { overwatchName: "cardComponent", component: Card },
            { overwatchName: "buttonComponent", component: Button },
            { overwatchName: "formComponent", component: Form },
        ]);
        super.RenderingStart(this.PagePath);

        this.StringFormatPlugin = new AxeView_StringFormatPlugin();

        this.StringFormatPlugin.AddHook("MONEY", {
            comma: (data, options) =>
            {
                return Number(data).toLocaleString();
            },
            currency: (data, options) =>
            {
                if ("" !== options.currency)
                {
                    return options.currency + " " + data;
                }
            }
        });
    }

    private AddOverwatchState = (): void =>
    {
        this.UseOverwatchMonitoringString("welcomeText", "Welcome to, Axe Shop");

        this.UseOverwatchAll({
            Name: "testSectionTitle",
            FirstData: "Test",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring_OneValue,
            OverwatchingOneIs: true,
        });

        this.UseOverwatchAll({
            Name: "testCurrentColorName",
            FirstData: "Primary",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring_OneValue,
            OverwatchingOneIs: true,
        });

        this.UseOverwatchAll({
            Name: "testCurrentColorClass",
            FirstData: "primary",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: false,
        });

        this.UseOverwatchAll({
            Name: "onClickColorChange",
            FirstData: this.OnClickColorChange,
            OverwatchingOutputType: OverwatchingOutputType.Function_NameRemoveOn,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: false,
        });

        this.UseOverwatchMonitoringString("outputValue", "");

        this.UseOverwatchAll({
            Name: "onChangeOutputValue",
            FirstData: this.onChangeOutputValue,
            OverwatchingOutputType: OverwatchingOutputType.Function_NameRemoveOn,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: true,
        });

        this.UseOverwatchAll({
            Name: "Money"
            , FirstData: "0"
            , OverwatchingOutputType: OverwatchingOutputType.String
            , OverwatchingType: OverwatchingType.Monitoring
            , OverwatchingOneIs: false
            , AxeDomSet_DataEdit: this.AxeDomSet_DataEdit
        });

        this.AddOverwatchComponent();
    };

    private AddOverwatchComponent()
    {
        this.UseOverwatchAll({
            Name: "cardComponent",
            FirstData: this.CreateLoadingDom("Card"),
            OverwatchingOutputType: OverwatchingOutputType.Dom,
            OverwatchingType: OverwatchingType.OutputFirst,
            OverwatchingOneIs: false,
            TossOption: JSON.parse(`{"message":"카드 컴포넌트"}`)
        });
        this.UseOverwatchComponent("buttonComponent", this.CreateLoadingDom("Button"));
        this.UseOverwatchComponent("formComponent", this.CreateLoadingDom("Form"));
    }

    private CreateLoadingDom = (sName: string): HTMLElement =>
    {
        const LoadingDom = document.createElement('div');
        LoadingDom.innerHTML = `<h1>${sName} Component Loading...</h1>`;

        return LoadingDom;
    };

    public onChangeOutputValue = (event: Event, sender: ChildNode, objThis: Overwatch): void =>
    {
        const Target = event.target as HTMLInputElement;
        const Value = Target.value;
        const OutputValue = this.AxeSelectorByName("outputValue");
        OutputValue.data = Value;
    };

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void
    {
        const TestButton = this.DomThis.querySelector('#btnClick') as HTMLButtonElement;
        const MoneyOverwatch = this.AxeSelectorByName("Money");
        console.log(MoneyOverwatch);

        TestButton.onclick = () =>
        {
            const InputValue = this.TextInput();
            const OutputValue = this.AxeSelectorByName("Money");
            OutputValue.data = InputValue;
        };
    }

    private TextInput = (): number =>
    {
        return Number((document.getElementById("txtInput") as HTMLInputElement).value);

    };

    private AxeDomSet_DataEdit = (
        objThis: Overwatch
        , axeDom: AxeViewDomInterface
        , data: any)
        : string =>
    {
        let sReturn = "";

        let tossOpt: { val: string, comma: string, currency: string; }
            = axeDom.TossOptionType<{ val: string, comma: string, currency: string; }>();
        let nMoney: number = Number(data);

        if (true === isNaN(nMoney))
        {
            // 숫자형이 아니라면 종료
            return;
        }

        sReturn = this.StringFormatPlugin.Use(data, tossOpt);

        return sReturn;
    };

    private OnClickColorChange = (event: Event, sender: ChildNode, objThis: Overwatch) =>
    {
        const Target = sender as HTMLElement;
        const ColorName = Target.id;
        const testSt = "123124213";

        switch (ColorName)
        {
            case "primary":
                this.ChangeColorAndName("primary");
                break;
            case "secondary":
                this.ChangeColorAndName("secondary");
                break;
            case "success":
                this.ChangeColorAndName("success");
                break;
            case "danger":
                this.ChangeColorAndName("danger");
                break;
            case "warning":
                this.ChangeColorAndName("warning");
                break;
            case "info":
                this.ChangeColorAndName("info");
                break;
            case "light":
                this.ChangeColorAndName("light");
                break;
            case "dark":
                this.ChangeColorAndName("dark");
                break;
            default:
                break;
        }
    };

    private ChangeColorAndName = (ColorName: string) =>
    {
        let UpperCaseColorName = ColorName.replace(/^[a-z]/, (char) => char.toUpperCase());
        this.AxeSelectorByName("testCurrentColorClass").data = ColorName;
        this.AxeSelectorByName("testCurrentColorName").data = UpperCaseColorName;
    };
}
