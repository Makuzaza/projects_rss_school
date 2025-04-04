export enum Endpoints {
    Sources = 'sources',
    Everything = 'everything',
    TopHeadlines = 'top-headlines',
}

export type HttpMethod = 'GET' | 'POST';

export interface LoaderOptions {
    [key: string]: string;
}

export interface NewsItem {
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    source: {
        name: string;
    };
}

export interface Source {
    id: string;
    name: string;
}

export type NewsResponse = {
    articles: ReadonlyArray<NewsItem>;
};

export type SourcesResponse = {
    sources: ReadonlyArray<Source>;
};
