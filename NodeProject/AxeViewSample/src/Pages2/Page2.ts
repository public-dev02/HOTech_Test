import Footer from './PageLayout/Footer/Footer';
import Header from './PageLayout/Header/Header';
import "./Page2.scss";
import PageComponent from "@/Faculty/Base/PageComponent";
import Aside from './PageLayout/Aside/Aside';

/**
 * Page Component를 생성하는 Class
 */
export default class Page2 extends PageComponent
{
    /** Page Component의 html 파일 주소 */
    private readonly PagePath: string = "Pages2/Page2.html";

    constructor()
    {
        /** 베이스가 되는 부모 Class인 PageComponent 상속 */
        super([
            { position: 'divAside', component: new Aside() }
        ]);
        /** this.PagePath를 통해서 렌더링 시작 */
        super.RenderingStart(this.PagePath);
    }

    /**
     * Dom이 생성되고 나서 실행되는 함수
     * @returns {void}
     */
    public RenderingComplete(): void
    {
        console.log('페이지 렌더링');
    }
}