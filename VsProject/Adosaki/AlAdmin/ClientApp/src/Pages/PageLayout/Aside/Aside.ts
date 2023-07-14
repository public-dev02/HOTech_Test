import ContentComponent from '@/Faculty/Base/ContentComponent';
import SimpleBar from 'simplebar';
import './Aside.scss';
import GlobalStatic from '@/Global/GlobalStatic';

/**
 * Header Component를 생성하는 Class
 */
export default class Aside extends ContentComponent {
    /** Header Component의 html 파일 주소 */
    private readonly PagePath: string = 'Pages/PageLayout/Aside/Aside.html';

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
        this.InitializeSimpleBar();
        this.SetActiveMenuEvent();
        this.SetSideBarToggleEvent();
    }

    private InitializeSimpleBar(): void {
        const ScrollTarget = this.DomThis.querySelector(
            'nav.sidebar-nav'
        ) as HTMLElement;
        const simplebar = new SimpleBar(ScrollTarget);
    }

    private SetActiveMenuEvent(): void {
        this.LoadActiveMenu();

        const NormalMenuList = this.DomThis.querySelectorAll(
            'li.sidebar-item.normal'
        ) as NodeListOf<HTMLElement>;
        const ToggleMenuList = this.DomThis.querySelectorAll(
            'li.sidebar-item.toggle'
        ) as NodeListOf<HTMLElement>;

        NormalMenuList.forEach((menu) => {
            menu.addEventListener('click', () => {
                NormalMenuList.forEach((menu) => {
                    menu.classList.remove('active');
                });

                ToggleMenuList.forEach((menu) => {
                    menu.classList.remove('open');
                    const list = menu.querySelector(
                        'ul.item-list'
                    ) as HTMLElement;
                    list.classList.remove('open');
                    list.style.maxHeight = null;
                });

                menu.classList.add('active');
            });
        });

        ToggleMenuList.forEach((menu) => {
            menu.addEventListener('click', (event: MouseEvent) => {
                const EventTarget = event.target as HTMLElement;

                const IsToggleMenu =
                    EventTarget.parentElement.classList.contains(
                        'sidebar-item'
                    ) ||
                    EventTarget.parentElement.classList.contains(
                        'item-content'
                    ) ||
                    EventTarget.parentElement.classList.contains('arrow') ||
                    EventTarget.parentElement.tagName === 'svg';

                if (!IsToggleMenu) {
                    NormalMenuList.forEach((menu) => {
                        menu.classList.remove('active');
                    });

                    ToggleMenuList.forEach((menu) => {
                        if (menu !== event.currentTarget) {
                            menu.classList.remove('open');
                            const list = menu.querySelector(
                                'ul.item-list'
                            ) as HTMLElement;
                            list.classList.remove('open');
                            list.style.maxHeight = null;
                        }
                    });

                    return;
                }

                const list = menu.querySelector('ul.item-list') as HTMLElement;

                menu.classList.toggle('open');
                list.classList.toggle('open');

                this.HeightAnimation(list);
            });
        });
    }

    private LoadActiveMenu(): void {
        const CurrentUrl = GlobalStatic.app.Router.getCurrentLocation().url;
        const CurrentMenu = this.DomThis.querySelector(
            `a[href="/${CurrentUrl}"]`
        ) as HTMLElement;
        const Parent = CurrentMenu.parentElement.parentElement as HTMLElement;
        const CurrentMenuParent = Parent.parentElement as HTMLElement;

        if (CurrentMenu.parentElement.classList.contains('sidebar-item')) {
            // treeview가 아닌 메뉴
            CurrentMenu.parentElement.classList.add('active');
        } else {
            // treeview 메뉴
            Parent.classList.add('open');
            CurrentMenuParent.classList.add('open');
        }

        this.HeightAnimation(Parent);
    }

    private HeightAnimation(Target: HTMLElement): void {
        if (!Target) {
            return;
        }

        if (Target.style.maxHeight) {
            Target.style.maxHeight = null;
        } else {
            Target.style.maxHeight = Target.scrollHeight + 22 + 'px';
        }
    }

    private SetSideBarToggleEvent(): void {
        this.DomThis.addEventListener('click', (event) => {
            const Target = event.target as HTMLElement;
            const TargetParent = Target.parentElement as HTMLElement;
            const IsButtonAndAnchor =
                Target.tagName === 'A' || TargetParent.tagName === 'A';

            if (IsButtonAndAnchor) {
                const SideBar: HTMLDivElement =
                    GlobalStatic.PageLayout.DomThis.querySelector(
                        '#divAside'
                    ) as HTMLDivElement;
                SideBar.classList.toggle('show');
            }
        });
    }
}
