export default class EditorEvent
{
    constructor() { }

    public PreviewButtonEvent(event: MouseEvent): void
    {
        const PreviewElement = document.querySelector(".preview-box") as HTMLElement;
        PreviewElement.classList.toggle("preview-box--show");
    }
}