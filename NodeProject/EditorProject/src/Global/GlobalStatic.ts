import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AppModule from "@/index";

/** 전역 변수 */
export default class GlobalStatic
{
    static { }

    /** 이 응용프로그램 */
    static App: AppModule | null;
}