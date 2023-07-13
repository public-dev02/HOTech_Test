import "./Header.scss";
import ContentComponent from "@/Faculty/Base/ContentComponent";
import GlobalStatic from "@/Global/GlobalStatic";

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
        // super.RenderingStart(this.PagePath);
    }

    public get GetPagePath(): string
    {
        return this.PagePath;
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @return {void}
     */
    public RenderingComplete(): void
    {
        this.SetSideBarToggleEvent();
    }

    private SetSideBarToggleEvent(): void
    {
        const ToggleButton: HTMLButtonElement = this.DomThis.querySelector(".sidebar-toggle-btn") as HTMLButtonElement;
        ToggleButton.addEventListener("click", () =>
        {
            const SideBar: HTMLDivElement = GlobalStatic.PageLayout.DomThis.querySelector("#divAside") as HTMLDivElement;
            SideBar.classList.toggle("show");
        });
    }
}
