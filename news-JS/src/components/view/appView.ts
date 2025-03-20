import News from './news/news';
import Sources from './sources/sources';

export interface NewsItem {
    source: { name: string };
    author?: string;
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
}

export type NewsResponse = {
    articles: ReadonlyArray<NewsItem>;
};

export interface Source {
    id: string;
    name: string;
}

export type SourcesResponse = {
    sources: ReadonlyArray<Source>;
};

export default class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: NewsResponse): void {
        const articles: ReadonlyArray<(typeof data.articles)[number]> = data.articles;
        this.news.draw(articles);
    }

    public drawSources(data: SourcesResponse): void {
        const sources: ReadonlyArray<(typeof data.sources)[number]> = data.sources;
        this.sources.draw(sources);
    }
}
