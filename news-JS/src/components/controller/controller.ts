import AppLoader from './appLoader';
import { Endpoints, LoaderOptions, NewsResponse, SourcesResponse } from '../../types';

export default class AppController extends AppLoader {
    public getSources(callback: (data: SourcesResponse) => void): void {
        this.getResp({ endpoint: Endpoints.Sources }, callback);
    }

    public getNews(e: Event, callback: (data: NewsResponse) => void): void {
        let target = e.target as HTMLElement;
        const newsContainer: HTMLElement = e.currentTarget as HTMLElement;

        while (target !== newsContainer && target !== null) {
            if (target.classList.contains('source__item')) {
                const sourceId: string = target.getAttribute('data-source-id') || '';
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);

                    const query: string = target.getAttribute('data-query') || sourceId;
                    const from: string | null = target.getAttribute('data-from');
                    const to: string | null = target.getAttribute('data-to');
                    const sortBy: string | null = target.getAttribute('data-sortby');
                    const country: string | null = target.getAttribute('data-country');
                    const category: string | null = target.getAttribute('data-category');
                    const endpointAttr: string = target.getAttribute('data-endpoint') || Endpoints.Everything;

                    const options: LoaderOptions = { q: query };
                    if (from) options.from = from;
                    if (to) options.to = to;
                    if (sortBy) options.sortBy = sortBy;
                    if (country) options.country = country;
                    if (category) options.category = category;

                    this.getResp<NewsResponse>({ endpoint: endpointAttr as Endpoints, options }, callback);
                }
                return;
            }
            target = target.parentNode as HTMLElement;
        }
    }
}

