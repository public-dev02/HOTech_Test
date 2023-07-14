import {
    OverwatchingOutputType,
    OverwatchingType,
} from '@/Utility/AxeView/OverwatchingType';
import './LoginForm.scss';
import ContentComponent from '@/Faculty/Base/ContentComponent';
import { Overwatch } from '@/Utility/AxeView/Overwatch';
import Cookies from 'js-cookie';
import GlobalStatic from '@/Global/GlobalStatic';

let TestUserInfo = {
    name: '테스트',
    id: 'test',
    password: '1234',
};

/**
 * Login Form Component를 생성하는 Class
 */
export default class LoginForm extends ContentComponent {
    /** About Component의 html 파일 주소 */
    private readonly PagePath: string =
        'AuthPages/Components/LoginForm/LoginForm.html';

    private LoginInput: { id: string; password: string } = {
        id: '',
        password: '',
    };

    constructor() {
        /** 베이스가 되는 부모 Class인 ContentComponent 상속 */
        super();
        /** 오버워치 감시자 등록 */
        this.AddOverwatchState();
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    private AddOverwatchState = (): void => {
        /** 로그인 버튼 클릭 이벤트 */
        this.UseOverwatchAll({
            Name: 'onSubmitLogin',
            FirstData: this.onSubmitLogin,
            OverwatchingOutputType:
                OverwatchingOutputType.Function_NameRemoveOn,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: true,
        });

        /** 아이디 값 감시 이벤트 */
        this.UseOverwatchAll({
            Name: 'onChangeId',
            FirstData: this.onChangeId,
            OverwatchingOutputType:
                OverwatchingOutputType.Function_NameRemoveOn,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: true,
        });

        /** 비밀번호 값 감시 이벤트 */
        this.UseOverwatchAll({
            Name: 'onChangePassword',
            FirstData: this.onChangePassword,
            OverwatchingOutputType:
                OverwatchingOutputType.Function_NameRemoveOn,
            OverwatchingType: OverwatchingType.Monitoring,
            OverwatchingOneIs: true,
        });

        /** 로그인 에러 메세지 이벤트 */
        this.UseOverwatchMonitoringString('LoginErrorMessage', '');
    };

    private onSubmitLogin = (
        event: Event,
        sender: ChildNode,
        objThis: Overwatch
    ): void => {
        event.preventDefault();
        const LoginErrorMessage = this.AxeSelectorByName('LoginErrorMessage');

        if (
            this.LoginInput.id === TestUserInfo.id &&
            this.LoginInput.password === TestUserInfo.password
        ) {
            Cookies.set(
                'USER_SESSION',
                'aweifjoi1j2o12ij12o3ij21dffadsdfasxcvx2213'
            );
            GlobalStatic.setUserInfo(TestUserInfo);
            GlobalStatic.app.Router.navigate('/admin');
            LoginErrorMessage.data = '';
        } else {
            LoginErrorMessage.data = '아이디 또는 비밀번호를 확인해주세요';
        }
    };

    private onChangeId = (
        event: Event,
        sender: ChildNode,
        objThis: Overwatch
    ): void => {
        const Input = event.target as HTMLInputElement;
        this.LoginInput.id = Input.value;
    };

    private onChangePassword = (
        event: Event,
        sender: ChildNode,
        objThis: Overwatch
    ): void => {
        const Input = event.target as HTMLInputElement;
        this.LoginInput.password = Input.value;
    };

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void {
        console.log('로그인 폼 컴포넌트 렌더링');
    }
}
