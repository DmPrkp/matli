import { Keys } from "@/types";

const defaultKeys = {
  en: "Request. Construction Calculator. Calculation of Building Materials",
  ru: "Заявка. Строительный калькулятор. Расчет строительных материалов",
};

const routeMeta: Keys = {
  catalog: {
    key: {
      en: "Catalogs: materials, hand and power tools",
      ru: "Сборники: материалы, ручной и электроинструмент",
    },
  },
  "catalog/materials": {
    key: {
      en: "Catalogs: building materials",
      ru: "Сборники: строительные материалы",
    },
  },
  "catalog/hand_tools": {
    key: {
      en: "Catalogs: hand tools",
      ru: "Сборники: ручной инструмент",
    },
  },
  "catalog/power_tools": {
    key: {
      en: "Catalogs: power tools",
      ru: "Сборники: электроинструмент",
    },
  },
  about: {
    key: {
      en: "About the Project",
      ru: "О проекте",
    },
  },
  "main/facade": {
    key: {
      en: "Facade Material Calculation",
      ru: "Расчет материалов для фасада",
    },
  },
  "main/facade/EIFS": {
    key: {
      en: "EIFS Material Calculation",
      ru: "Расчет материалов для мокрого фасада",
    },
  },
  "main/facade/frame_scaffold": {
    key: {
      en: "frame scaffold Calculation",
      ru: "Расчет рамных лесов",
    },
  },
};

export { routeMeta, defaultKeys };
