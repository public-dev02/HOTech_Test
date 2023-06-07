import GlobalStatic from "@/Global/GlobalStatic";

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
        console.log(EditorInstance.getData());
    }

    public UpdatePreview(): void
    {
        const PreviewIframe = document.querySelector(".preview-iframe") as HTMLIFrameElement;
        const PreviewContent = GlobalStatic.Editor.getData();

        const PreviewDocument = PreviewIframe.contentWindow.document;
        PreviewDocument.open();
        PreviewDocument.write(PreviewContent);
        PreviewDocument.close();
    }
}