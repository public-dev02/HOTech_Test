import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Header.scss";

export default class Header extends ContentComponent
{
    private readonly PagePath: string = "Pages/PageLayout/Header/Header.html";

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
        console.log("헤더 렌더링");
    }
}
