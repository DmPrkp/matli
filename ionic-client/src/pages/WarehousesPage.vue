<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-item-divider>
        <ion-title>{{ $t("pages.warehouses.title") }}</ion-title>
      </ion-item-divider>

      <!-- Заглушка: раздел заведён в меню заранее, наполнение будет позже. -->
      <div class="stub">
        <ion-icon :icon="archiveOutline" />
        <ion-note>{{ $t('ui.labels["disable"]') }}</ion-note>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
  import { IonIcon, IonNote } from "@ionic/vue";
  import { archiveOutline } from "ionicons/icons";
</script>

<style scoped>
  .stub {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 16px;
    text-align: center;
  }

  /* Цвет текста с прозрачностью: --ion-color-medium в тёмной теме сливается с фоном. */
  .stub ion-icon {
    font-size: 4rem;
    color: var(--ion-text-color);
    opacity: 0.35;
  }
</style>
