<template>
  <ion-button
    :aria-label="`Language: ${locale}`"
    @click="switchLocale"
  >
    <ion-icon
      slot="start"
      :icon="languageOutline"
    />
    <span class="locale_code">{{ locale.toUpperCase() }}</span>
  </ion-button>
</template>

<script setup lang="ts">
  import { IonButton, IonIcon } from "@ionic/vue";
  import { languageOutline } from "ionicons/icons";
  import { computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { Locale } from "@/types";
  import {
    SUPPORTED_LOCALES,
    normalizeLocale,
    resolveInitialLocale,
  } from "@/plugins/i18n";

  const route = useRoute();
  const router = useRouter();

  const locale = computed<Locale>(
    () => normalizeLocale(route.params.locale) || resolveInitialLocale()
  );

  const nextLocale = computed<Locale>(() => {
    const index = SUPPORTED_LOCALES.indexOf(locale.value);
    return SUPPORTED_LOCALES[(index + 1) % SUPPORTED_LOCALES.length];
  });

  /**
   * Локаль — часть URL, поэтому меняем сегмент пути. Словарь догрузит и
   * применит гвард роутера, так что переход дождётся нужного языка.
   */
  function switchLocale() {
    const value = nextLocale.value;
    const segments = route.fullPath.split("/");
    segments[1] = value;
    router.replace(segments.join("/") || `/${value}/main`);
  }
</script>

<style scoped>
  .locale_code {
    font-size: 0.85em;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
</style>
