import ContentComponent from '@/Faculty/Base/ContentComponent';
import './Notice.scss';

/**
 * Home Component를 생성하는 Class
 * Index가 되는 페이지이다.
 */
export default class Notice extends ContentComponent {
    /** Home Component의 html 파일 주소 */
    private readonly PagePath: string = 'Pages/Site/Notice/Notice.html';

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
        console.log('공지사항 관리 페이지 렌더링');
    }
}
