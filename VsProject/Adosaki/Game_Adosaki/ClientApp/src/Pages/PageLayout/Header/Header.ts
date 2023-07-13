import "./Header.scss";
import ContentComponent from "@/Faculty/Base/ContentComponent";

/**
 * Header Component를 생성하는 Class
 */
export default class Header extends ContentComponent {
    /** Header Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages/PageLayout/Header/Header.html";

    constructor() {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
    }

    public get GetPagePath(): string {
        return this.PagePath;
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @return {void}
     */
    public RenderingComplete(): void {
        console.log("헤더 렌더링");
    }
}
