import "@/Pages/Page.scss";
import PageComponent from "@/Faculty/Base/PageComponent";

export default class Page extends PageComponent
{
    private readonly PagePath: string = "Pages/Page.html";

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
        console.log('페이지 렌더링');
    }
}