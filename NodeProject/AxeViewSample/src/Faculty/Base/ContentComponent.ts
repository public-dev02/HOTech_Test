import HeosabiComponent from "./HeosabiComponent";

/**
 * UI에서 사용하는 Component들의 부모가 되는 Class이다.
 */
export default class ContentComponent extends HeosabiComponent
{
    constructor()
    {
        super();
    }

    public AsyncRenderingStart()
    {
        console.log('AsyncRendringstart');
        super.RenderingStart(this.GetPagePath);
    }

    public get GetPagePath(): string
    {
        return '';
    }
}