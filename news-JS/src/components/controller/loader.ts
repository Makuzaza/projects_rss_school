export type HttpMethod = 'GET' | 'POST';

export interface LoaderOptions {
    [key: string]: string;
}

export enum Endpoints {
    Sources = 'sources',
    Everything = 'everything',
    TopHeadlines = 'top-headlines',
}

export default class Loader {
    protected baseLink: string;
    protected options: Readonly<LoaderOptions>;

    constructor(baseLink: string, options: LoaderOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(params: { endpoint: Endpoints; options?: LoaderOptions }, callback: (data: T) => void): void {
        this.load<T>('GET', params.endpoint, callback, params.options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            console.error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw new Error(res.statusText);
        }
        return res;
    }

    private makeUrl(options: LoaderOptions = {}, endpoint: string): string {
        const urlOptions: LoaderOptions = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;
        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });
        return url.slice(0, -1);
    }

    private load<T>(
        method: HttpMethod,
        endpoint: string,
        callback: (data: T) => void,
        options: LoaderOptions = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data: T) => callback(data))
            .catch((err) => console.error(err));
    }
}
