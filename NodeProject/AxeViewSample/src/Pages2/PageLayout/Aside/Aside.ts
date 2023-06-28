import ContentComponent from "@/Faculty/Base/ContentComponent";
import SimpleBar from "simplebar";
import "./Aside.scss";
import GlobalStatic from "@/Global/GlobalStatic";

/**
 * Header Component를 생성하는 Class
 */
export default class Aside extends ContentComponent
{
    /** Header Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages2/PageLayout/Aside/Aside.html";

    constructor()
    {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
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
        this.InitializeSimpleBar();
        this.SetActiveMenuEvent();
        this.SetSideBarToggleEvent();
    }

    private InitializeSimpleBar(): void
    {
        const ScrollTarget = this.DomThis.querySelector('nav.sidebar-nav') as HTMLElement;
        const simplebar = new SimpleBar(ScrollTarget);
    }

    private SetActiveMenuEvent(): void
    {
        this.LoadActiveMenu();

        const MenuList = this.DomThis.querySelectorAll('nav.sidebar-nav ul li a') as NodeListOf<HTMLElement>;
        MenuList.forEach((menu) =>
        {
            menu.addEventListener('click', () =>
            {
                MenuList.forEach((menu) =>
                {
                    menu.classList.remove('active');
                });

                menu.classList.add('active');
            });
        });
    }

    private LoadActiveMenu(): void
    {
        const CurrentUrl = GlobalStatic.app.Router.getCurrentLocation().url;
        const CurrentMenu = this.DomThis.querySelector(`a[href="/${CurrentUrl}"]`) as HTMLElement;

        CurrentMenu.classList.add('active');
    }

    private SetSideBarToggleEvent(): void
    {
        this.DomThis.addEventListener("click", (event) =>
        {
            const Target = event.target as HTMLElement;
            const TargetParent = Target.parentElement as HTMLElement;
            const IsButtonAndAnchor =
                (Target.tagName === "BUTTON" || Target.tagName === "A")
                || (TargetParent.tagName === "A" || TargetParent.tagName === "BUTTON");

            if (IsButtonAndAnchor)
            {
                const SideBar: HTMLDivElement = GlobalStatic.PageLayout.DomThis.querySelector("#divAside") as HTMLDivElement;
                SideBar.classList.toggle("show");
            }
        });

    }
}
