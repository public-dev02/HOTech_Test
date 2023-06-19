import { NavigateMatchModel } from "./NavigateMatchModel";
import { ResolveOptions } from "./NavigateResolveModel";
import { NavigateOptions } from "./NavigateOptionsModel";


/** 라우터가 구현해야할 원형 */
export default interface RouterProviderInterface
{
    /**
     * 라우트 동작을 추가한다.
     * *오버로드는 화살표 함수를 만들 수 없어 오버로드로 구현하지 않는다.
     * @param path
     * @param handler
     * @returns
     */
    on(path: string | Function | RegExp
        , handler?: Function): RouterProviderInterface;

    /**
     * Not Found 페이지를 추가한다.
     * @param handler
     * @returns
     */
    notFound(handler?: Function): RouterProviderInterface;

    /**
     * 현재 주소창의 url을 변경해주는 함수이다.
     * @param {string} path
     * @param {ResolveOptions} resolveOptions 
     * @returns {RouterProviderInterface}
     */
    resolve(path?: string, resolveOptions?: ResolveOptions): RouterProviderInterface;

    navigate(to: string, options?: NavigateOptions): RouterProviderInterface;
}