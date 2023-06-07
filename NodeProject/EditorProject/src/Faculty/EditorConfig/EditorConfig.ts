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
            language: 'ko',
        };
    }
}