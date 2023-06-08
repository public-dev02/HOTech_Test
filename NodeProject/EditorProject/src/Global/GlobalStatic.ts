import ClassicEditor from "@/Faculty/ClassicEditor/ClassicEditor";
import AppModule from "@/index";

/** 전역 변수 */
export default class GlobalStatic
{
    static { }

    /** 이 응용프로그램 */
    static App: AppModule | null;
    /** 에디터 Instance */
    static Editor: ClassicEditor;
    /** 에디터 Placholder */
    static EditorPlaceholder: string = "내용을 입력해주세요...";
    /** 에디터 Mode */
    static EditorMode: 'wysiwyg' | 'markdown' = 'wysiwyg';
}