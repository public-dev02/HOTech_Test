import GlobalStatic from "@/Global/GlobalStatic";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm";
import EditorConfig from "../EditorConfig/EditorConfig";
import EditorEvent from "../EditorEvent/EditorEvent";

export default class Editor
{
    public Editor: ClassicEditor;

    private Config = new EditorConfig();
    private Event = new EditorEvent();

    constructor() { }

    public CreateEditor(element: HTMLElement): void
    {
        const EditorWrapper = document.createElement("div");
        EditorWrapper.classList.add('editor-wrapper');

        const EditorTitle = document.createElement("h1");
        EditorTitle.classList.add('editor-title');
        EditorTitle.textContent = "Editor";

        const EditorElement = document.createElement("div");
        EditorElement.classList.add('ckeditor-feature');

        const EditorBox = document.createElement("div");
        EditorBox.classList.add('editor-box');

        const ActionsBox = this.CreateActionsBoxElement();

        const PreviewElement = this.CreatePreviewElement();

        ClassicEditor.create(EditorElement, this.Config.GetConfig)
            .then(editor =>
            {
                this.Editor = editor;

                editor.model.document.on('change:data', () =>
                {
                    const content = editor.getData();
                    this.UpdatePreview();
                });
            });

        EditorBox.appendChild(EditorTitle);
        EditorBox.appendChild(EditorElement);
        EditorBox.appendChild(ActionsBox);

        EditorWrapper.appendChild(EditorBox);
        EditorWrapper.appendChild(PreviewElement);

        element.appendChild(EditorWrapper);
    }

    private CreatePreviewElement(): HTMLElement
    {
        const PreviewWrapper = document.createElement("div");
        PreviewWrapper.classList.add('preview-box');

        const PreviewTitle = document.createElement("h1");
        PreviewTitle.classList.add('preview-title');
        PreviewTitle.textContent = "Preview";

        const PreviewIframe = document.createElement("iframe");
        PreviewIframe.classList.add('preview-iframe');

        PreviewWrapper.appendChild(PreviewTitle);
        PreviewWrapper.appendChild(PreviewIframe);

        return PreviewWrapper;
    }

    private CreateActionsBoxElement(): HTMLElement
    {
        const ActionsBox = document.createElement("div");
        ActionsBox.classList.add('actions-box');

        const PreviewButton = document.createElement("button");
        PreviewButton.classList.add('preview-button');
        PreviewButton.textContent = "미리보기";

        PreviewButton.addEventListener("click", this.Event.PreviewButtonEvent);

        ActionsBox.appendChild(PreviewButton);

        return ActionsBox;
    }

    public UpdatePreview(): void
    {
        const PreviewIframe = document.querySelector(".preview-iframe") as HTMLIFrameElement;
        const PreviewContent = this.Editor.getData();

        const PreviewDocument = PreviewIframe.contentWindow.document;
        PreviewDocument.open();
        PreviewDocument.write(PreviewContent);
        PreviewDocument.close();
    }
}