import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Footer.scss";
import GlobalStatic from "@/Global/GlobalStatic";
import AsyncHtmlLoader from '@/Utility/AsyncHTMLLoader/async-html-loader';

export default class Footer extends ContentComponent
{
    private readonly PagePath: string = "Pages/PageLayout/Footer/Footer.html";

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
        console.log('푸터 렌더링');
    }
}


