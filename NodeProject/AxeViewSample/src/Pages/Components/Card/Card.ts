import { Overwatch } from "@/Utility/AxeView/Overwatch";
import "./Card.scss";
import ContentComponent from "@/Faculty/Base/ContentComponent";

/**
 * About Component를 생성하는 Class
 * Route 확인을 위해 임시로 만든 Component 이다.
 */
export default class Card extends ContentComponent
{
    /** About Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages/Components/Card/Card.html";

    constructor()
    {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void
    {
        const overwatch = this.OverwatchThis;
        const option = this.GetOptions<TestInterface>();
        console.log(option);
    }
}

interface TestInterface
{
    message: string;
    comma: boolean;
    num: number;
}