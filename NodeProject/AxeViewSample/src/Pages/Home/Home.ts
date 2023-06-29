import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Home.scss";
import { OverwatchingOutputType, OverwatchingType } from "@/Utility/AxeView/OverwatchingType";
import { Overwatch } from "@/Utility/AxeView/Overwatch";
import Card from "../Components/Card/Card";
import HeosabiComponent from "@/Faculty/Base/HeosabiComponent";

/**
 * Home Component를 생성하는 Class
 * Index가 되는 페이지이다.
 */
export default class Home extends ContentComponent
{
    /** Home Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages/Home/Home.html";
    private Card: HeosabiComponent = new Card();

    constructor()
    {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        this.AddOverwatchState();
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    private AddOverwatchState(): void
    {
        this.UseOverwatch({
            Name: "welcomeText",
            FirstData: "Welcome to, Axe Shop",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: false,
        });

        this.UseOverwatch({
            Name: "testSectionTitle",
            FirstData: "Test",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring_OneValue,
            OverwatchingOneIs: true,
        });

        this.UseOverwatch({
            Name: "testCurrentColorName",
            FirstData: "Primary",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring_OneValue,
            OverwatchingOneIs: true,
        });

        this.UseOverwatch({
            Name: "testCurrentColorClass",
            FirstData: "primary",
            OverwatchingOutputType: OverwatchingOutputType.String,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: false,
        });

        this.UseOverwatch({
            Name: "onClickColorChange",
            FirstData: this.OnClickColorChange,
            OverwatchingOutputType: OverwatchingOutputType.Function_NameRemoveOn,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: false,
        });
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void
    {
        const welcomeText = this.AxeSelectorByName('welcomeText');
        console.log(this.Card);
    }

    private OnClickColorChange = (
        event: Event,
        sender: ChildNode,
        objThis: Overwatch
    ) =>
    {
        const Target = sender as HTMLElement;
        const ColorName = Target.id;

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
        }
    };

    private ChangeColorAndName = (ColorName: string) =>
    {
        let UpperCaseColorName = ColorName.replace(/^[a-z]/, char => char.toUpperCase());
        this.AxeSelectorByName("testCurrentColorClass").data = ColorName;
        this.AxeSelectorByName("testCurrentColorName").data = UpperCaseColorName;
    };
}

