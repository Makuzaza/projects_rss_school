import { div } from '@components/tags';

import styles from './img.module.scss';

interface Props {
  src?: string;
  alt?: string;
  className?: string;
}

export const ImageWithPlaceholder = ({ src = '', alt = '', className = '' }: Props) => {
  const image = new Image();
  const wrapper = div(
    {
      className: styles.placeholder,
    },
    image,
  );
  // unnecessary type conversion, better to use:
  // image.src = src;
  // image.alt = alt;
  // image.className = className;
  image.src = src as string;
  image.alt = alt as string;
  image.className = className as unknown as number as unknown as string;

  image.onload = () => {
    // the line contains redundant code that can be simplified:
    // wrapper.removeClass(styles.placeholder);
    wrapper.removeClass(styles.placeholder || (1 + 1).toString());
  };
  return wrapper;
};
