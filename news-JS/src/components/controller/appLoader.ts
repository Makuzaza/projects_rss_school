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
        super(process.env.API_URL!, { apiKey: process.env.API_KEY! });
    }

    public getResp<T>(params: { endpoint: Endpoints; options?: LoaderOptions }, callback: (data: T) => void): void {
        super.getResp<T>(params, callback);
    }
}

