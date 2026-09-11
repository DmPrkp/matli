/** Этапы работ внутри системы; position — порядок слоя. */
type WorkStage = { id: number; title: string; systemId: number; position: number };

export const workStages: WorkStage[] = [
  {"id": 1, "title": "surface preparation", "systemId": 1, "position": 1},
  {"id": 2, "title": "insulation coat", "systemId": 1, "position": 2},
  {"id": 3, "title": "fiberglass mesh", "systemId": 1, "position": 3},
  {"id": 4, "title": "finish coat", "systemId": 1, "position": 4},
  {"id": 5, "title": "paint layer", "systemId": 1, "position": 5},
  {"id": 6, "title": "scaffolding installation", "systemId": 2, "position": 1},
  {"id": 7, "title": "fastening scaffolding", "systemId": 2, "position": 2},
];
