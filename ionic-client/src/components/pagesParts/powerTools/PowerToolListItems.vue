<template>
  <ion-list>
    <ion-item
      v-for="(tool, num) in modelValue"
      :key="tool.uniqKey"
    >
      <ion-grid>
        <ion-row color="secondary">
          <ion-col size="1">
            {{ num + 1 }}
          </ion-col>
          <ion-col
            size="7"
            class="ion-align-items-start"
          >
            <div>
              {{ tool.ru_title }}
              {{ $t(`current.${tool.corded ? "ac" : "dc"}`) }}
              <span
                v-for="param in tool.params"
                :key="param.param"
              >
                {{ param.param }} {{ $t(`measure.${param.measure}`) }} {{ " " }}
              </span>
            </div>
          </ion-col>

          <!-- Right side: adjusted consumption -->
          <ion-col
            size="1"
            class="ion-text-right"
          >
            <ion-button
              shape="round"
              fill="outline"
              color="medium"
              @click="action(--tool.adjusted_consumption, tool)"
            >
              <ion-icon
                slot="icon-only"
                :icon="remove"
              ></ion-icon>
            </ion-button>
          </ion-col>

          <ion-col
            size="1"
            class="ion-text-right"
          >
            {{ tool.adjusted_consumption }}
          </ion-col>

          <ion-col
            size="1"
            class="ion-text-right"
          >
            <ion-button
              shape="round"
              fill="outline"
              color="medium"
              @click="action(++tool.adjusted_consumption, tool)"
            >
              <ion-icon
                slot="icon-only"
                :icon="add"
              ></ion-icon>
            </ion-button>
          </ion-col>
          <ion-col
            size="1"
            class="ion-text-right"
          >
            {{ $t("measure.pcs") }}
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
  import { PowerTool } from "@/types/dto";
  import { add, remove } from "ionicons/icons";

  const props = defineProps<{
    modelValue: PowerTool[];
  }>();

  const emit = defineEmits(["update:modelValue", "delete"]);

  function action(val: number, tool: PowerTool) {
    if (val < 1) {
      emit("delete", tool.uniqKey);
      val = 0;
    }

    tool.adjusted_consumption = val;
    emit("update:modelValue", props.modelValue);
  }
</script>
