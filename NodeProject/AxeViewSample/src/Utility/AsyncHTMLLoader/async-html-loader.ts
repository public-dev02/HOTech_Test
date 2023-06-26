import { HtmlContent, HtmlContentOptions, LoaderFunction, LoaderOptions, } from "./async-html-loader.type";

/**
 * HTML 파일을 비동기적으로 불러와 조작할 수 있도록 도와주는 Class
 * @usage const asyncHtmlLoader = new AsyncHtmlLoader(htmlContentFunction)
 * @class
 */
class AsyncHtmlLoader
{
    /** AJAX 호출로 받아온 HTML TEXT */
    private htmlContents: HtmlContent[];
    private htmlContentFunction: LoaderFunction;
    private contentOptions: LoaderOptions;
    private BaseUrl: string = "http://localhost:4060";

    constructor(
        htmlContentOption: HtmlContentOptions =
            {
                loaderOption: {
                    retry: 3,
                },
                loaderFunction: {},
            }
    )
    {
        this.htmlContents = [];
        this.htmlContentFunction = htmlContentOption.loaderFunction as LoaderFunction;
        this.contentOptions = htmlContentOption.loaderOption as LoaderOptions;
    }

    /**
     * 모든 html 파일에 대한 AJAX 요청이 시작되기 전 실행하는 콜백 함수
     * @private
     */
    private onMutate(): void
    {
        // onSuccess 함수에 대한 콜백을 받지 않았으면 실행하지 않는다.
        if (undefined === this.htmlContentFunction.onMutate)
        {
            return;
        }

        this.htmlContentFunction.onMutate();
    }

    /**
     * 모든 html 파일에 대한 AJAX 요청이 끝난 후 실행되는 콜백 함수
     * @param { HtmlContent[] } data 필요에 따라서 htmlContnents 배열을 다룰 수 있다.
     * @private
     */
    private onSuccess(data: HtmlContent[] = this.htmlContents): void
    {
        // onSuccess 함수에 대한 콜백을 받지 않았으면 실행하지 않는다.
        if (undefined === this.htmlContentFunction.onSuccess)
        {
            return;
        }

        if (undefined === data)
        { // 파라미터로 data 를 포함하지 않았을 때
            this.htmlContentFunction.onSuccess();
        }
        else
        { // 파라미터로 data 를 포함했을 때
            this.htmlContentFunction.onSuccess(data);
        }
    }

    /**
     * AJAX 요청중 에러가 발생했을 때 실행되는 콜백 함수
     * @param { any } error try-catch 에서 catch에서 주는 error 객체
     * @param { HtmlContent } data 불러온 htmlContent 객체
     * @private
     */
    private async onError(error: any, data: HtmlContent): Promise<void>
    {
        // onError 함수에 대한 콜백을 받지 않았으면 실행하지 않는다.
        if (undefined === this.htmlContentFunction.onError)
        {
            console.error(error);
            return;
        }

        let errorCount = 0;

        while (errorCount < this.contentOptions.retry - 1)
        {
            await this.refetchHtmlFile(data);
            errorCount++;
        }

        this.htmlContentFunction.onError(error);
    }

    /**
     * AJAX 호출 시 각각 요소들을 불러올때 마다 실행되는 함수
     * @param { HtmlContent } data 불러온 htmlContent 객체
     * @private
     */
    private onEachSuccess(data: HtmlContent): void
    {
        if (undefined === this.htmlContentFunction.onEachSuccess)
        {
            return;
        }

        this.htmlContentFunction.onEachSuccess(data);
    }

    /**
     * HTML 파일 경로를 파라미터로 받아 paths 배열에 저장하는 함수
     * @param { string } item
     */
    public addPath(item: string): void
    {
        // 만약 htmlContents에 해당 Url의 파일이 이미 있다면 함수를 종료한다. ( 중복제거 )
        const findItem = this.htmlContents.find((content) => content.url === item);
        if (undefined !== findItem)
        {
            return;
        }

        this.htmlContents.push({
            url: item,
            htmlString: "",
            isFinished: false,
            finishedCallback: [],
        });
    }

    /**
     * HTML 파일 경로가 담긴 배열을 인자로 받아 paths 배열에 저장하는 함수
     * @param { string[] } items HTML 파일 경로가 담긴 배열
     */
    public addPaths(items: string[]): void
    {
        items.forEach((item) =>
        {
            // 만약 htmlContents에 해당 Url의 파일이 이미 있다면 함수를 종료한다. ( 중복제거 )
            const findItem = this.htmlContents.find((content) => content.url === item);
            if (undefined !== findItem)
            {
                return;
            }

            this.htmlContents.push({
                url: item,
                htmlString: "",
                isFinished: false,
                finishedCallback: [],
            });
        });
    }

    /**
     * 함수가 호출되면 paths 배열을 반복문을 돌려 AJAX 호출을 하고 결과를 htmlContents 에 저장한다.
     */
    public startLoad(): void
    {
        this.onMutate();
        for (const item of this.htmlContents)
        {
            try
            {
                // AJAX 요청을 시작하기 전 실행되는 콜백
                this.fetchHtmlFile(item);
            }
            catch (error: any)
            {
                this.onError(error, item);
            }
        }
    }

    public async AsyncStartLoad()
    {
        this.onMutate();
        for (const item of this.htmlContents)
        {
            try
            {
                // AJAX 요청을 시작하기 전 실행되는 콜백
                await this.fetchHtmlFile(item);
            }
            catch (error: any)
            {
                this.onError(error, item);
            }
        }
    }

    public async fetchHtmlFile(item: HtmlContent): Promise<void>
    {
        try
        {
            const response = await fetch(`${this.BaseUrl}/${item.url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8",
                    "Accept": "text/plain"
                }
            });
            if (response.ok)
            {
                item.htmlString = await response.text();
                item.isFinished = true;
                this.onEachSuccess(item);

                // fnishedCallback Array에 함수가 하나라도 있다면 콜백을 실행한다.
                if (item.finishedCallback.length > 0)
                {
                    for (const callback of item.finishedCallback)
                    {
                        callback(item);
                    }

                    // callback 함수가 모두 호출되면 배열을 초기화 한다.
                    item.finishedCallback = [];
                }

                // htmlContents에서 isFinished가 false인 것을 찾는다.
                const findUnfinishedItem = this.htmlContents.filter((content) => content.isFinished === false);

                // htmlContent에서 isFinished가 false인 item이 없다면 onSuccess 콜백을 실행
                if (findUnfinishedItem.length === 0)
                { // AJAX 호출이 성공적으로 끝난 후 실행되는 콜백
                    this.onSuccess();
                }
            }
            else
            {
                throw new Error('NotFoundFilePath');
            }
        }
        catch (error: any)
        {
            this.onError(error, item);
        }
    }

    public async refetchHtmlFile(item: HtmlContent): Promise<void>
    {
        try
        {
            const response = await fetch(item.url, {
                method: "GET",
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8",
                    "Accept": "text/plain"
                }
            });

            if (response.ok)
            {
                item.htmlString = await response.text();
                item.isFinished = true;
                this.onEachSuccess(item);

                // htmlContents에서 isFinished가 false인 것을 찾는다.
                const findUnfinishedItem = this.htmlContents.filter((content) => content.isFinished === false);

                // htmlContent에서 isFinished가 false인 item이 없다면 onSuccess 콜백을 실행
                if (findUnfinishedItem.length === 0)
                { // AJAX 호출이 성공적으로 끝난 후 실행되는 콜백
                    this.onSuccess();
                }
            }
        }
        catch (error: any)
        {
            console.error(error);
        }
    }

    /**
     * 저장된 htmlContents가 있다면 가져온다.
     */
    public get getHTML(): HtmlContent[]
    {
        if (this.htmlContents.length > 0)
        {
            return this.htmlContents;
        }
        else
        {
            return [];
        }
    }

    /**
     * 저장된 htmlContents에서 파라미터로 받은 url에 맞는 html 문자열을 가져온다.
     * @param { string } url
     */
    public getHTMLByUrl(url: string): HtmlContent | null
    {
        const findHtml = this.htmlContents.find((content) => content.url === url);

        if (undefined !== findHtml)
        { // 찾는 html 객체가 있다면
            return findHtml;
        }
        else
        { // 찾는 html 객체가 없다면
            return null;
        }
    }

    public async asyncGetHTMLByUrl(url: string, callback: (data: HtmlContent) => void): Promise<HtmlContent | undefined>
    {
        const findHtml = this.htmlContents.find((content) => content.url === url);

        if (undefined === findHtml)
        {
            return;
        }

        if (true === findHtml.isFinished)
        {
            callback(findHtml);
        }
        else
        {
            await new Promise<void>((resolve) =>
            {
                findHtml.finishedCallback.push(() =>
                {
                    callback(findHtml);
                    resolve();
                });
            });
        }

        return findHtml;
    }
}
export default AsyncHtmlLoader;
