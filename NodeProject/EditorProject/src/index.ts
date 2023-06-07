import "@/Styles/style.css";
import "@/Styles/customEditorStyle.css";

import Editor from "./Faculty/Editor/Editor";
import GlobalStatic from "./Global/GlobalStatic";

export default class AppModule
{
    public RootElement: HTMLElement;

    private Editor: Editor = new Editor();

    constructor()
    {
        this.RootElement = document.querySelector("#root") as HTMLElement;
        GlobalStatic.App = this;
        console.log(GlobalStatic.App);

        /** Editor 생성 */
        this.Editor.CreateEditor(this.RootElement);
    }
}

const appModule = new AppModule();