import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Forms.scss";

/**
 * Home Component를 생성하는 Class
 * Index가 되는 페이지이다.
 */
export default class Forms extends ContentComponent
{
    /** Home Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages2/Forms/Forms.html";

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

    }
}

