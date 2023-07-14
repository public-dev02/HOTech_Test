import "./RegisterForm.scss";
import ContentComponent from "@/Faculty/Base/ContentComponent";

/**
 * Login Form Component를 생성하는 Class
 */
export default class RegisterForm extends ContentComponent {
    /** About Component의 html 파일 주소 */
    private readonly PagePath: string = "AuthPages/Components/RegisterForm/RegisterForm.html";

    constructor() {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void {
        console.log("회원가입 폼 컴포넌트 렌더링");
    }
}

