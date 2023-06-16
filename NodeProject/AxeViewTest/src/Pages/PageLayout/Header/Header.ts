import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Header.scss";

/**
 * Header Component를 생성하는 Class
 */
export default class Header extends ContentComponent
{
    /** Header Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages/PageLayout/Header/Header.html";

    constructor()
    {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @return {void}
     */
    public RenderingComplete(): void
    {
        console.log("헤더 렌더링");
    }
}
