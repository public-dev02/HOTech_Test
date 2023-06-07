import GlobalStatic from "@/Global/GlobalStatic";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm";
import EditorConfig from "../EditorConfig/EditorConfig";

export default class Editor
{
    public Editor: ClassicEditor;

    private Config = new EditorConfig();

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

        const PreviewElement = this.CreatePreview();

        ClassicEditor.create(EditorElement, this.Config.GetConfig)
            .then(editor =>
            {
                this.Editor = editor;

                editor.model.document.on('change:data', () =>
                {
                    const content = editor.getData();
                    console.log('changed content: ', content);
                    this.UpdatePreview();
                });
            });

        EditorWrapper.appendChild(EditorTitle);
        EditorWrapper.appendChild(EditorElement);
        EditorWrapper.appendChild(PreviewElement);

        element.appendChild(EditorWrapper);
    }

    private CreatePreview(): HTMLElement
    {
        const PreviewWrapper = document.createElement("div");
        PreviewWrapper.classList.add('preview-wrapper');

        const PreviewTitle = document.createElement("h1");
        PreviewTitle.classList.add('preview-title');
        PreviewTitle.textContent = "Preview";

        const PreviewIframe = document.createElement("iframe");
        PreviewIframe.classList.add('preview-iframe');

        const PreviewButton = document.createElement("button");
        PreviewButton.classList.add('preview-button');
        PreviewButton.textContent = "Preview";

        PreviewWrapper.appendChild(PreviewButton);
        PreviewWrapper.appendChild(PreviewTitle);
        PreviewWrapper.appendChild(PreviewIframe);

        return PreviewWrapper;
    }

    private UpdatePreview(): void
    {
        const PreviewIframe = document.querySelector(".preview-iframe") as HTMLIFrameElement;
        const PreviewContent = this.Editor.getData();

        const PreviewDocument = PreviewIframe.contentWindow.document;
        PreviewDocument.open();
        PreviewDocument.write(PreviewContent);
        PreviewDocument.close();
    }
}