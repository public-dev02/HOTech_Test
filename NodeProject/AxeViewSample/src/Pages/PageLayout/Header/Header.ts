import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Header.scss";
import Page from "@/Pages/Page";

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
        const ToggleButton = this.DomThis.querySelector(".navbar-toggler") as HTMLButtonElement;
        const Target = ToggleButton.dataset.target as string;
        const TargetDom = this.DomThis.querySelector(Target) as HTMLElement;

        ToggleButton.addEventListener("click", () =>
        {
            TargetDom.classList.toggle("show");

            if (ToggleButton.getAttribute('aria-expanded') === "true")
            {
                ToggleButton.classList.add("collapsed");
            }
            else
            {
                ToggleButton.classList.remove("collapsed");
            }

            ToggleButton.setAttribute('aria-expanded', TargetDom.classList.contains("show") ? "true" : "false");
        });
    }
}
