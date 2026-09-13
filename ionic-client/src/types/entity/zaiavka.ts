import { MaterialListDTO, MergedHandTool, PowerTool } from "../dto";

export type ZaiavkaType = {
  id?: number;
  system: string;
  hand_tools: MergedHandTool[];
  materials: MaterialListDTO[];
  power_tools: PowerTool[];
};
