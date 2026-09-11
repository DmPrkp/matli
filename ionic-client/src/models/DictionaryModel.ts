import BaseModel from "./BaseModel";
import type {
  DictionaryHandTool,
  DictionaryMaterial,
  DictionaryPage,
  DictionaryPowerTool,
  DictionaryVariant,
} from "@/types/dto";

export type CatalogQuery = {
  page?: number;
  limit?: number;
  q?: string;
};

function toQueryString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.q?.trim()) params.set("q", query.q.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default class DictionaryModel extends BaseModel {
  static apiVersion = "/dict/api/v1";

  // BaseModel склеивает baseURL + apiVersion + params встык,
  // поэтому путь обязан начинаться со слэша — как в BaseCalcModel.

  static materials(query: CatalogQuery = {}) {
    return this.get<DictionaryPage<DictionaryMaterial>>(
      `/materials${toQueryString(query)}`
    );
  }

  static handTools(query: CatalogQuery = {}) {
    return this.get<DictionaryPage<DictionaryHandTool>>(
      `/hand-tools${toQueryString(query)}`
    );
  }

  static powerTools(query: CatalogQuery = {}) {
    return this.get<DictionaryPage<DictionaryPowerTool>>(
      `/power-tools${toQueryString(query)}`
    );
  }

  static materialVariants(id: number) {
    return this.get<DictionaryVariant[]>(`/materials/${id}/variants`);
  }

  static handToolVariants(id: number) {
    return this.get<DictionaryVariant[]>(`/hand-tools/${id}/variants`);
  }
}
