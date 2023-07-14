import ContentComponent from '@/Faculty/Base/ContentComponent';
import './NotFound.scss';

/**
 * NotFound Component를 생성하는 Class
 * 잘못된 경로로 접속시 나타나는 페이지이다.
 */
export default class NotFound extends ContentComponent {
    /** Home Component의 html 파일 주소 */
    private readonly PagePath: string = 'Pages/NotFound/NotFound.html';

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
    public RenderingComplete(): void {}
}
