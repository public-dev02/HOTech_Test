import ContentComponent from "@/Faculty/Base/ContentComponent";
import GlobalStatic from "@/Global/GlobalStatic";

export default class NotFound extends ContentComponent
{
    private readonly PagePath: string = "Pages/NotFound/NotFound.html";

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
        const Router = GlobalStatic.app.Router;
        Router.Rewrite('/404');
    }
}

