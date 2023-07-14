import ContentComponent from "@/Faculty/Base/ContentComponent";
import "./Register.scss";
import RegisterForm from "../Components/RegisterForm/RegisterForm";

/**
 * Home Component를 생성하는 Class
 * Index가 되는 페이지이다.
 */
export default class Register extends ContentComponent {
    /** Home Component의 html 파일 주소 */
    private readonly PagePath: string = "AuthPages/Register/Register.html";

    constructor() {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        this.AddOverwatchState()
        this.AddChildComponent([
            { overwatchName: "RegisterFormComponent", component: RegisterForm }
        ])
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    private AddOverwatchState = (): void => {
        this.AddComponents();
    }

    private AddComponents() {
        this.UseOverwatchComponent("RegisterFormComponent", this.CreateLoadingDom("RegisterForm"));
    }

    private CreateLoadingDom = (sName: string): HTMLElement => {
        const LoadingDom = document.createElement('div');
        LoadingDom.innerHTML = `<h1>${sName} Component Loading...</h1>`;

        return LoadingDom;
    };


    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void {
        console.log("회원가입 페이지 렌더링");
    }
}

