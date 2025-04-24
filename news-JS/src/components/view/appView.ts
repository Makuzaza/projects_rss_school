import News from './news/news';
import Sources from './sources/sources';
import { NewsResponse, SourcesResponse } from '../../types';

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
