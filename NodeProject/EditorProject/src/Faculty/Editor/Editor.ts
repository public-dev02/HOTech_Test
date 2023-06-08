import GlobalStatic from "@/Global/GlobalStatic";
import EditorEvent from "../EditorEvent/EditorEvent";
import ClassicEditor from "../ClassicEditor/ClassicEditor";

export default class Editor
{
    private Event = new EditorEvent();

    constructor() { }

    public CreateEditor(element: HTMLElement): void
    {
        const EditorWrapper = document.createElement("div");
        EditorWrapper.classList.add('editor-wrapper');

        const EditorBox = document.createElement("div");
        EditorBox.classList.add('editor-box');

        const EditorTitle = document.createElement("h1");
        EditorTitle.classList.add('editor-title');
        EditorTitle.textContent = "Editor";

        const EditorElement = document.createElement("div");
        EditorElement.classList.add('ckeditor-feature');

        const ActionsBox = this.CreateActionsBoxElement();
        const PreviewElement = this.CreatePreviewElement();

        ClassicEditor.create(EditorElement)
            .then(editor =>
            {
                GlobalStatic.Editor = editor;

                editor.model.document.on('change:data', () =>
                {
                    const content = editor.getData();
                    this.Event.UpdatePreview();
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
        PreviewTitle.textContent = "미리보기";

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

        const LeftBox = document.createElement("div");
        LeftBox.classList.add('left-box');

        const RightBox = document.createElement("div");
        RightBox.classList.add('right-box');

        const MarkdownToggleButton = document.createElement("button");
        MarkdownToggleButton.classList.add('markdown-toggle-button');
        MarkdownToggleButton.textContent = "Markdown";
        MarkdownToggleButton.addEventListener("click", this.Event.MarkdownToggleButtonEvent);

        const PreviewButton = document.createElement("button");
        PreviewButton.classList.add('preview-button');
        PreviewButton.textContent = "미리보기";
        PreviewButton.addEventListener("click", this.Event.PreviewButtonEvent);

        const WriteButton = document.createElement("button");
        WriteButton.classList.add('write-button');
        WriteButton.textContent = "글작성";
        WriteButton.addEventListener("click", this.Event.WriteButtonEvent);

        LeftBox.appendChild(MarkdownToggleButton);
        RightBox.appendChild(PreviewButton);
        RightBox.appendChild(WriteButton);

        ActionsBox.appendChild(LeftBox);
        ActionsBox.appendChild(RightBox);

        return ActionsBox;
    }
}