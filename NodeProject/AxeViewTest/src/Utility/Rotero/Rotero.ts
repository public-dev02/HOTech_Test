import { match } from "./pregexp";

export type RouteHandler = (req: Request, res: Response) => void;
export type Routes = Map<string, RouteHandler>;
export type ReqParams = Map<string, string>;

export type Request = {
    url: string;
    path: string;
    query: URLSearchParams;
    params: ReqParams;
};
export type Response = {
    title: string;
    body: string;
    style: string;
    send(body: string): void;
    goto(route: string): void;
};

function default_route(req: Request, res: Response) {
    res.title = "404 | Not Found";
    res.body = `
        <h1>Page ${req.path}</h1>
        <h1>404 not found</h1>
    `;
    res.style = `* {
            box-sizing: border-box;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            text-align: center;
        }
    `;
    console.error(`GET ${req.path} 404 (Page not found)`);
}

function route_manager(root: HTMLElement, routes: Routes, def: RouteHandler): void {
    let path: string = window.location.hash.substring(1);
    let query: URLSearchParams = new URLSearchParams(window.location.search);

    let req: Request = {
        url: window.location.href,
        path,
        params: new Map(),
        query,
    } as Request;
    let res: Response = {
        title: document.body.title,
        body: root.innerHTML.toString(),
        send: function (body: string): void {
            res.body = body;
        },
        goto: function (route: string): void {
            const url = new URL(window.location.href);
            url.hash = route;
            window.location.href = url.href;
        },
    } as Response;

    let handler: RouteHandler = get_handler(path, req, routes) ?? def;
    handler(req, res);

    if (res.title) document.title = res.title;
    if (res.style) res.body += `<style>${res.style}</style>`;

    // root.innerHTML = res.body;
}

function get_handler(path: string, req: Request, routes: Routes): RouteHandler | null {
    let handler: RouteHandler | null = null;

    routes.forEach((val, key) => {
        let result: any = match(key, { encode: encodeURI, decode: decodeURI })(path);
        req.path = result.path || path;

        if (result) {
            if (result.params) {
                (Object.keys(result.params) as (keyof typeof result.params)[]).forEach((key) => {
                    req.params.set(key as string, result.params[key] as string);
                });
            }
            handler = val;
        }
    });

    return handler;
}

export class Router {
    private node: string;
    private root: HTMLElement;
    private routes: Routes;
    public all: RouteHandler;

    constructor(node: string = "#app") {
        this.node = node;
        this.routes = new Map();
        let app: null | HTMLElement = document.querySelector(this.node);
        if (!app) {
            app = document.createElement("div");
            app.setAttribute("id", this.node);
            document.body.appendChild(app);
        }
        this.root = app;
        this.all = default_route;
    }

    public on(route: string, handler: RouteHandler): void {
        this.routes.set(route, handler);
    }

    public use(route: string, router: Router): void {
        router.routes.forEach((v: RouteHandler, k: string, _: Routes) =>
            this.routes.set(route + k, v)
        );
    }

    public remove(route: string): void {
        this.routes.delete(route);
    }

    public run(): void {
        window.addEventListener("DOMContentLoaded", (): void =>
            route_manager(this.root, this.routes, this.all)
        );
        window.addEventListener("hashchange", (): void => {
            console.log("hash change");
            route_manager(this.root, this.routes, this.all);
        });
    }

    public refresh(): void {
        console.log("refresh : " + this.root + ", " + this.routes);
        route_manager(this.root, this.routes, this.all);
    }
}

export default function createRouter() {
    return new Router();
}
