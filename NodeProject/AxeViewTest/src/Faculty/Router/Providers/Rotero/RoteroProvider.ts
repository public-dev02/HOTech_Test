import rotero, { Router as RoteroRouter } from '@/Utility/Rotero/Rotero';
import RouterProviderBase from "../../RouterProviderBase";
import { NavigateMatchModel } from '../../Models/NavigateMatchModel';
import RouterProviderInterface from '../../Models/RouterProviderInterface';
import GlobalStatic from '@/Global/GlobalStatic';

export default class RoteroProvider extends RouterProviderBase implements RouterProviderInterface
{
    /** 로테로 라우터 개체 */
    private Rotero: RoteroRouter = new RoteroRouter('#root');

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

            this.Rotero.on(path, (req, res) =>
            {
                console.log(GlobalStatic);
                let newMatch: NavigateMatchModel = {
                    url: req.url
                    , queryString: ""
                    , hashString: ""
                    , data: []
                };

                // 데이터가 없으면 빈 객체를 추가 후 바로 넘긴다.
                if (0 >= req.params.size && 0 >= req.query.size)
                {
                    newMatch.data.push({
                        key: ""
                        , param: ""
                    });

                    console.log(newMatch);
                    handlerTemp(newMatch);
                    return;
                };

                // 데이터가 있으면 데이터를 추가 후 넘긴다.
                for (let param of req.params)
                {
                    newMatch.data.push({
                        key: param[0]
                        , param: param[1]
                    });
                }

                for (let query of req.query)
                {
                    newMatch.data.push({
                        key: query[0]
                        , param: query[1]
                    });
                }

                console.log(newMatch);

                handlerTemp(newMatch);
            });
        }

        return this;
    };

    public resolve = (): RouterProviderInterface =>
    {
        this.Rotero.run();

        return this;
    };

    public notFound = (handler?: (match: NavigateMatchModel) => void): RouterProviderInterface =>
    {
        let handlerTemp: (match: NavigateMatchModel) => void = handler;

        this.Rotero.all = (req, res) =>
        {
            let newMatch: NavigateMatchModel = {
                url: "404"
                , queryString: ""
                , hashString: ""
                , data: [{
                    key: "",
                    param: ""
                }]
            };

            handlerTemp(newMatch);
        };
        return this;
    };

    public navigate = (to: string, options?: any): RouterProviderInterface =>
    {
        window.location.hash = to;

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
        this.Rotero.refresh();
    }
}