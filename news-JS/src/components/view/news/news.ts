import './news.css';

export interface NewsItem {
    source: { name: string };
    author?: string;
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
}

export default class News {
    public draw(data: ReadonlyArray<NewsItem>): void {
        const news = data.length >= 10 ? data.slice(0, 10) : data;
        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector<HTMLTemplateElement>('#newsItemTemp');

        if (!newsItemTemp) {
            console.error('Template element #newsItemTemp not found');
            return;
        }

        news.forEach((item: NewsItem, idx: number) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

            const newsItem = newsClone.querySelector('.news__item');
            if (newsItem && idx % 2 === 1) {
                newsItem.classList.add('alt');
            }

            const metaPhoto = newsClone.querySelector('.news__meta-photo') as HTMLElement | null;
            if (metaPhoto) {
                metaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
            }

            const metaAuthor = newsClone.querySelector('.news__meta-author');
            if (metaAuthor) {
                metaAuthor.textContent = item.author || item.source.name;
            }

            const metaDate = newsClone.querySelector('.news__meta-date');
            if (metaDate) {
                metaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');
            }

            const descriptionTitle = newsClone.querySelector('.news__description-title');
            if (descriptionTitle) {
                descriptionTitle.textContent = item.title;
            }

            const descriptionSource = newsClone.querySelector('.news__description-source');
            if (descriptionSource) {
                descriptionSource.textContent = item.source.name;
            }

            const descriptionContent = newsClone.querySelector('.news__description-content');
            if (descriptionContent) {
                descriptionContent.textContent = item.description;
            }

            const readMoreLink = newsClone.querySelector('.news__read-more a');
            if (readMoreLink) {
                readMoreLink.setAttribute('href', item.url);
            }

            fragment.append(newsClone);
        });

        const newsContainer = document.querySelector('.news');
        if (newsContainer) {
            newsContainer.innerHTML = '';
            newsContainer.appendChild(fragment);
        } else {
            console.error('Container .news not found');
        }
    }
}

