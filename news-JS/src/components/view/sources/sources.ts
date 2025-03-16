import './sources.css';

export interface Source {
    id: string;
    name: string;
}

export default class Sources {
    private wheelEventListener: ((event: WheelEvent) => void) | null = null;

    constructor() {
        this.wheelEventListener = null;
    }

    public draw(data: ReadonlyArray<Source>): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');

        if (!sourceItemTemp) {
            console.error('Template element #sourceItemTemp not found');
            return;
        }

        data.forEach((item: Source) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as DocumentFragment;
            const sourceItemName = sourceClone.querySelector('.source__item-name');
            const sourceItem = sourceClone.querySelector('.source__item');

            if (sourceItemName && sourceItem) {
                sourceItemName.textContent = item.name;
                sourceItem.setAttribute('data-source-id', item.id);
            }

            fragment.append(sourceClone);
        });

        const sourcesContainer = document.querySelector('.sources');
        if (sourcesContainer) {
            sourcesContainer.append(fragment);

            this.updateWheelEventListener(sourcesContainer as HTMLElement);

            window.addEventListener('resize', () => {
                this.updateWheelEventListener(sourcesContainer as HTMLElement);
            });
        } else {
            console.error('Container .sources not found');
        }
    }

    private updateWheelEventListener(sourcesContainer: HTMLElement): void {
        if (window.innerWidth > 640) {
            if (!this.wheelEventListener) {
                this.wheelEventListener = (event: WheelEvent) => {
                    event.preventDefault(); 
                    sourcesContainer.scrollBy({
                        left: event.deltaY * 7,
                        behavior: 'smooth'
                    });
                };
                sourcesContainer.addEventListener('wheel', this.wheelEventListener);
            }
        } else {
            if (this.wheelEventListener) {
                sourcesContainer.removeEventListener('wheel', this.wheelEventListener);
                this.wheelEventListener = null;
            }
        }
    }
}
