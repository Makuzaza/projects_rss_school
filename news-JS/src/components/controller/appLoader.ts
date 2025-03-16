import Loader from './loader';

export enum Endpoints {
    Sources = 'sources',
    Everything = 'everything',
    TopHeadlines = 'top-headlines',
}

export interface LoaderOptions {
    [key: string]: string;
}

export default class AppLoader extends Loader {
    constructor() {
        super('https://rss-news-api.onrender.com/', { apiKey: 'f71329f71a744bcebb469891d7bd44c8' });
    }

    public getResp<T>(params: { endpoint: Endpoints; options?: LoaderOptions }, callback: (data: T) => void): void {
        const optionsWithApiKey = { ...params.options, apiKey: 'f71329f71a744bcebb469891d7bd44c8' };
        super.getResp<T>({ endpoint: params.endpoint, options: optionsWithApiKey }, callback);
    }
}

