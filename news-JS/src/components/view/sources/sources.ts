import './sources.css';

export interface Source {
    id: string;
    name: string;
}

export default class Sources {
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
        } else {
            console.error('Container .sources not found');
        }
    }
}
