import { defineStore } from "pinia";
import { MaterialRequestDTO, StoredMaterialRequestDTO } from "@/types/dto";

export const useZaiavkaStore = defineStore("materialRequests", {
  state: () => {
    return {} as Record<MaterialRequestDTO["id"], MaterialRequestDTO>;
  },
  actions: {
    setMaterialRequest(materialRequest: MaterialRequestDTO): void {
      this.$state[materialRequest.id] = materialRequest;
    },

    getMaterialRequest(
      id: MaterialRequestDTO["id"],
    ): StoredMaterialRequestDTO | undefined {
      const zaiavka = this.$state[id];

      if (!zaiavka) return;

      return Object.assign({}, zaiavka, { data: JSON.parse(zaiavka.data) });
    },

    getAll(): StoredMaterialRequestDTO[] {
      const resultMatReq = Object.keys(this.$state)
        .map((key) => this.getMaterialRequest(Number(key)))
        .reverse();
      return resultMatReq.filter((mr) => mr !== undefined);
    },

    define(materialsRequests: MaterialRequestDTO[]): void {
      materialsRequests.forEach(this.setMaterialRequest);
    },
  },
});
