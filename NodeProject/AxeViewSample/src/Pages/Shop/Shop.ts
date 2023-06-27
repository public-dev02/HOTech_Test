import "./Shop.scss";
import ContentComponent from "@/Faculty/Base/ContentComponent";

/**
 * About Component를 생성하는 Class
 * Route 확인을 위해 임시로 만든 Component 이다.
 */
export default class Shop extends ContentComponent
{
    /** About Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages/Shop/Shop.html";

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
        console.log("샵 렌더링");
    }
}

