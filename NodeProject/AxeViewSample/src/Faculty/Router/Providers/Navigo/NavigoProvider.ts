import Navigo, { Match } from "navigo";

import RouterProviderBase from "@/Faculty/Router/RouterProviderBase";
import RouterProviderInterface from "@/Faculty/Router/Models/RouterProviderInterface";
import { NavigateMatchModel } from "@/Faculty/Router/Models/NavigateMatchModel";
import PageComponent from "@/Faculty/Base/PageComponent";


export default class NavigoProvider
    extends RouterProviderBase
    implements RouterProviderInterface
{
    /** 네비고 개체*/
    private Navigo: Navigo = new Navigo("/");

    private resolveIs: boolean = false;

    constructor(defaultPage: new () => PageComponent)
    {
        super(defaultPage);
    }

    public on = (path: string | Function | RegExp
        , handler?: (match: NavigateMatchModel) => void)
        : RouterProviderInterface =>
    {
        if ("string" === typeof path
            && "function" === typeof handler)
        {

            let handlerTemp: (match: NavigateMatchModel) => void = handler;

            this.Navigo.on(
                path
                , (match: Match) =>
                {
                    let newMatch: NavigateMatchModel = {
                        url: match.url
                        , queryString: match.queryString
                        , hashString: match.hashString
                        , data: []
                    };

                    // 데이터가 없으면 빈 객체를 추가 후 바로 넘긴다.
                    if (null === match.data && null === match.params)
                    {
                        newMatch.data.push({
                            key: ""
                            , param: ""
                        });

                        handlerTemp(newMatch);
                        return;
                    };

                    // 데이터가 있으면 데이터를 추가 후 넘긴다.

                    for (let key in match.data)
                    {
                        newMatch.data.push({
                            key
                            , param: match.data[key]
                        });
                    }

                    for (let key in match.params)
                    {
                        newMatch.data.push({
                            key
                            , param: match.params[key]
                        });
                    }

                    handlerTemp(newMatch);
                });
        }

        return this;
    };

    public resolve = (): RouterProviderInterface =>
    {
        if (false === this.resolveIs)
        {

            //네비고에서 리졸브를 두번하면 돔을 못찾는 현상이 있다.
            this.resolveIs = true;
            this.Navigo.resolve();
        }


        return this;
    };

    public notFound = (handler?: (match: NavigateMatchModel) => void): RouterProviderInterface =>
    {
        if ("function" === typeof handler)
        {
            this.Navigo.notFound(handler);
        }

        return this;
    };

    public navigate = (to: string, options?: any): RouterProviderInterface =>
    {
        this.Navigo.navigate(to, options);

        return this;
    };

    public getCurrentLocation = (): Match =>
    {
        return this.Navigo.getCurrentLocation();
    };
}