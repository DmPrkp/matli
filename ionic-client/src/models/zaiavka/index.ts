import { ZaiavkaType } from "@/types/entity/zaiavka";
import BaseOrderModel from "./BaseZaiavkaModel";
import { MaterialRequestDTO } from "@/types/dto";

export default class Zaiavka {
  data: ZaiavkaType;

  static async findAll() {
    const materialRequests =
      await BaseOrderModel.get<MaterialRequestDTO[]>("/zaiavka");
    return materialRequests || [];
  }

  static async find(id: number) {
    const materialRequest = await BaseOrderModel.get<MaterialRequestDTO>(
      `/zaiavka/${id}`,
    );
    return materialRequest;
  }

  constructor(data: ZaiavkaType) {
    this.data = {
      system: data.system,
      hand_tools: data.hand_tools ?? [],
      materials: data.materials ?? [],
      power_tools: data.power_tools ?? [],
    };
  }

  create() {
    return BaseOrderModel.post<MaterialRequestDTO>({
      params: "/zaiavka",
      body: this.data,
    });
  }

  generateSheetFile(format: string) {
    return BaseOrderModel.downloadFile({
      params: `/${format}-generator`,
      body: this.data,
    });
  }

  update(id: number, data: ZaiavkaType) {
    return BaseOrderModel.put<MaterialRequestDTO>({
      params: `/zaiavka/${id}`,
      body: data,
    });
  }
}
