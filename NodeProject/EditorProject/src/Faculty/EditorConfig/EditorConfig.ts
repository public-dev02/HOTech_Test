export default class EditorConfig
{
    constructor() { }

    public get GetConfig()
    {
        return {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    'imageUpload',
                    'undo',
                    'redo',
                ]
            },
            placeholder: '내용을 입력해주세요...',
            language: 'ko',
        };
    }
}