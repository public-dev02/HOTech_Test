/**
 * ajax를 통해 받아온 html file에 대한 정보 모델
 * @interface
 */
export interface HtmlContent
{
    url: string,
    htmlString: string,
    isFinished: boolean,
    finishedCallback: ((data: HtmlContent) => void)[],
}

/**
 * AsyncHtmlLoader 인스턴스의 파라미터로 들어갈 option interface
 * @interface
 */
export interface HtmlContentOptions
{
    loaderOption?: LoaderOptions,
    loaderFunction?: LoaderFunction
}

/**
 * AJAX 요청과, HtmlContent를 다루기 위한 옵션을 정의하는 모델
 * @interface
 */
export interface LoaderOptions
{
    retry: number
}

/**
 * AJAX 요청과, HtmlContent를 다루기 위한 함수 객체 모델
 * @interface
 */
export interface LoaderFunction
{
    // AJAX 콜이 호출되기 전 Callback
    onMutate?: () => void,
    // AJAX 콜이 호출된 후 Callback
    onSuccess?: (data?: HtmlContent[]) => void,
    // AJAX 콜 호출시 에러가 났을 때 Callback
    onError?: (error: any) => void,
    // AJAX 콜을 호출했을 때 각각 item 들이 성공했을 때 개별적으로 실행할 콜백 함수
    onEachSuccess?: (data?: HtmlContent) => void,
}