import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Home.scss";

export default class Home extends ContentComponent
{
    private readonly PagePath: string = "Pages/Home/Home.html";

    constructor()
    {
        super();
        super.RenderingStart(this.PagePath);
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     */
    public RenderingComplete(): void
    {
        console.log("홈 렌더링");
    }
}

