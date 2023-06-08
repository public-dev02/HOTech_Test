import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Bold, Code, Italic, Strikethrough, Underline, Superscript, Subscript } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link, LinkImage } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table } from '@ckeditor/ckeditor5-table';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import { Markdown } from '@ckeditor/ckeditor5-markdown-gfm';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import GlobalStatic from '@/Global/GlobalStatic';

export default class ClassicEditor extends ClassicEditorBase { }

ClassicEditor.builtinPlugins = [
    Essentials,
    Bold,
    Italic,
    Superscript,
    Subscript,
    Underline,
    Strikethrough,
    Paragraph,
    Alignment,
    CodeBlock,
    BlockQuote,
    Heading,
    Link,
    List,
    Code,
    MediaEmbed,
    Table,
    Indent,
    Base64UploadAdapter,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    LinkImage,
    ImageUpload,
    Autoformat,
    Markdown
];

ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'undo', 'redo',
            '|', 'heading',
            '|', 'bold', 'italic', 'underline', 'strikethrough',
            '|', 'bulletedList', 'numberedList',
            '|', 'alignment', 'outdent', 'indent',
            '|', 'uploadImage', 'insertTable', 'mediaEmbed',
            '|', 'link', 'blockQuote', 'codeBlock', 'code'
        ]
    },
    image: {
        toolbar: [
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'toggleImageCaption',
            'imageTextAlternative'
        ]
    },
    language: 'ko',
    placeholder: GlobalStatic.EditorPlaceholder
};

export function toggleMarkdownPlugin()
{
    if (GlobalStatic.EditorMode === 'wysiwyg')
    {
        console.log('마크다운 추가함');
        ClassicEditor.builtinPlugins.push(Markdown);
    }
    else
    {
        console.log('마크다운 제거함');
        ClassicEditor.builtinPlugins.pop();
    }
}