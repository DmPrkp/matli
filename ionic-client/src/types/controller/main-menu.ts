import { ImageType } from "../entity/image";

export type MainMenuItem = {
  /** Карточка с фотографией. Если её нет — рисуем icon. */
  img?: ImageType;
  /** Имя иконки из ionicons — запасной вариант для разделов без фото. */
  icon?: string;
  title: string;
  description: string;
  items?: MainMenuItem[];
  disable?: boolean;
};
