import ContentComponent from "@/Faculty/Base/ContentComponent";
import GlobalStatic from "@/Global/GlobalStatic";

export default class About extends ContentComponent
{
    private readonly PagePath: string = "Pages/About/About.html";

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
        console.log("어바웃 렌더링");
    }
}

