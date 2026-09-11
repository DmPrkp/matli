<template>
  <ion-page v-if="route.name === 'catalog'">
    <ion-content class="ion-padding">
      <ion-item-divider>
        <ion-title>{{ $t("pages.catalog.title") }}</ion-title>
      </ion-item-divider>
      <MainMenuItems
        :items="CATALOG_MENU"
        i18n-prefix="pages.catalog.tabs"
        @item="chooseSection"
      />
    </ion-content>
  </ion-page>
  <router-view v-else />
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from "vue-router";
  import MainMenuItems from "@/components/pagesParts/MainMenuItems.vue";
  import type { MainMenuItem } from "@/types/controller/main-menu";
  import { CATALOG_MENU } from "@/constants";

  const route = useRoute();
  const router = useRouter();

  function chooseSection(item: MainMenuItem) {
    router.push({ name: "catalog-section", params: { tab: item.title } });
  }
</script>
