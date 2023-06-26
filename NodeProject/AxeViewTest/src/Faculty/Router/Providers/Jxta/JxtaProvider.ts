import Router from '@/Utility/JxtaHashRouter/JxtaHashRouter';
import { Match, Handler } from '@/Utility/JxtaHashRouter/types/types';
import RouterProviderBase from "../../RouterProviderBase";
import { NavigateMatchModel } from '../../Models/NavigateMatchModel';
import RouterProviderInterface from '../../Models/RouterProviderInterface';
import GlobalStatic from '@/Global/GlobalStatic';

export default class JxtaProvider extends RouterProviderBase implements RouterProviderInterface
{
    /** 로테로 라우터 개체 */
    private Router: Router = new Router(false);

    constructor()
    {
        super();
    }

    public on = (path: string | Function | RegExp
        , handler?: (match: NavigateMatchModel) => void)
        : RouterProviderInterface =>
    {
        if ("string" === typeof path
            && "function" === typeof handler)
        {
            let handlerTemp: (match: NavigateMatchModel) => void = handler;

            this.Router.on(
                path,
                (match: Match) =>
                {
                    let newMatch: NavigateMatchModel = {
                        url: match.url
                        , queryString: match.queryString
                        , hashString: ""
                        , data: []
                    };

                    // 데이터가 없으면 빈 객체를 추가 후 바로 넘긴다.
                    if (0 >= match.query.size && 0 >= match.params.size)
                    {
                        newMatch.data.push({
                            key: ""
                            , param: ""
                        });

                        handlerTemp(newMatch);
                        return;
                    }

                    // 데이터가 있으면 데이터를 추가 후 넘긴다.
                    for (let param of match.params)
                    {
                        newMatch.data.push({
                            key: param[0]
                            , param: param[1]
                        });
                    }

                    for (let query of match.query)
                    {
                        newMatch.data.push({
                            key: query[0]
                            , param: query[1]
                        });
                    }

                    console.log(newMatch);
                    handlerTemp(newMatch);
                }
            );
        }
        return this;
    };

    public resolve = (): RouterProviderInterface =>
    {
        this.Router.resolve();
        return this;
    };

    public notFound = (handler?: (match: NavigateMatchModel) => void): RouterProviderInterface =>
    {
        this.Router.notFound(handler);

        return this;
    };

    public navigate = (to: string, options?: any): RouterProviderInterface =>
    {
        this.Router.navigate(to);

        return this;
    };

    public AddHashToURL()
    {
        if (!window.location.hash)
        {
            window.location.hash = '/';
        }
    }

    public refresh()
    {
        this.Router.refresh();
    }
}