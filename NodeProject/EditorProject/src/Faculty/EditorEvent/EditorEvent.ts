import GlobalStatic from "@/Global/GlobalStatic";
import { marked } from "marked";

export default class EditorEvent
{
    constructor() { }

    public PreviewButtonEvent = (event: MouseEvent): void =>
    {
        const PreviewElement = document.querySelector(".preview-box") as HTMLElement;
        PreviewElement.classList.toggle("preview-box--show");
        this.UpdatePreview();
    };

    public WriteButtonEvent(event: MouseEvent): void
    {
        const EditorInstance = GlobalStatic.Editor;
        const { EditorMode } = GlobalStatic;
        const data = EditorInstance.getData();

        if (EditorMode === 'wysiwyg')
        {
            console.log(marked(data), { mangle: false, headerIds: false });
        }
        else
        {
            console.log(data);
        }
    }

    public UpdatePreview(): void
    {
        const { EditorMode, Editor: EditorInstance } = GlobalStatic;
        const data = EditorInstance.getData();
        const PreviewIframe = document.querySelector(".preview-iframe") as HTMLIFrameElement;
        let PreviewContent = GlobalStatic.Editor.getData();

        if (EditorMode === 'wysiwyg')
        {
            PreviewContent = marked(data, { mangle: false, headerIds: false });
        }
        else
        {
            PreviewContent = data;
        }

        const PreviewDocument = PreviewIframe.contentWindow.document;
        PreviewDocument.open();
        PreviewDocument.write(PreviewContent);
        PreviewDocument.close();
    }

    public MarkdownToggleButtonEvent(event: MouseEvent): void
    {
        const target = event.target as HTMLButtonElement;

        if (GlobalStatic.EditorMode === 'wysiwyg')
        {
            GlobalStatic.EditorMode = 'markdown';
            target.textContent = "마크다운";
            console.log(GlobalStatic.EditorMode);
        }
        else
        {
            GlobalStatic.EditorMode = 'wysiwyg';
            target.textContent = "에디터";
            console.log(GlobalStatic.EditorMode);
        }

    }
}