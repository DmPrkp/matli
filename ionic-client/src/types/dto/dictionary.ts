/** Ответы dictionary-server (/dict/api/v1). */

export type DictionaryPage<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type DictionaryUnit = {
  id: number;
  code: string;
  nameRu: string;
  nameEn: string;
};

/** Тип материала: пиломатериалы, крепёж, леса… У материала может отсутствовать. */
export type DictionaryMaterialType = {
  id: number;
  code: string;
  nameRu: string;
  nameEn: string;
};

export type DictionaryMaterial = {
  id: number;
  nameRu: string;
  nameEn: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  isActive: boolean;
  unit: DictionaryUnit;
  type: DictionaryMaterialType | null;
  variantsCount: number;
};

export type DictionaryHandTool = {
  id: number;
  nameRu: string;
  nameEn: string;
  isActive: boolean;
  /** Сколько типоразмеров у позиции. 0 — разворачивать нечего. */
  variantsCount: number;
};

/**
 * Расписан целиком, а не через DictionaryHandTool & {...}: у электроинструмента
 * типоразмеров не бывает, и variantsCount сервер для него не отдаёт.
 */
export type DictionaryPowerTool = {
  id: number;
  nameRu: string;
  nameEn: string;
  isActive: boolean;
  isCorded: boolean;
};

/** Параметр типоразмера: значение с единицей и видом (длина, диаметр…). */
export type DictionaryVariantParam = {
  paramValueId: number;
  value: string;
  unit: string;
  kind: string | null;
};

/** Типоразмер позиции: дюбель Ø8 × 226 мм, рулетка 5 м. */
export type DictionaryVariant = {
  id: number;
  code: string;
  ownerId: number;
  isActive: boolean;
  params: DictionaryVariantParam[];
};
