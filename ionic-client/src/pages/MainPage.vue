<template>
  <ion-page v-if="isMainPage">
    <ion-refresher
      slot="fixed"
      @ionRefresh="handleRefresh($event)"
    >
      <ion-refresher-content />
    </ion-refresher>
    <ion-content class="ion-padding">
      <ion-item-divider>
        <ion-title v-if="mainMenu.length">
          {{ $t(`pages.main.title`) }}
        </ion-title>
      </ion-item-divider>
      <main-menu-items
        :items="mainMenu"
        @item="chooseItem"
      />
    </ion-content>
  </ion-page>
  <router-view v-else />
</template>

<script lang="ts" setup>
  import { computed, onMounted, type ComputedRef, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { RefresherCustomEvent } from "@ionic/vue";
  import MainMenuItems from "@/components/ui/MainMenuItems.vue";
  import BaseModel from "@/models/BaseModel";
  import type { MainMenuItem } from "../types/controller/main-menu";
  import { useMainMenuStore } from "@/store/MainMenuStore";

  const router = useRouter();
  const route = useRoute();

  const mainMenuStore = useMainMenuStore();
  const isMainPage = ref(route.name === "main");
  watch(
    () => route.name,
    () => (isMainPage.value = route.name === "main")
  );

  const mainMenu: ComputedRef<MainMenuItem[]> = computed(
    () => mainMenuStore.mainMenu
  );

  async function getMainMenu() {
    const menu = await BaseModel.get<MainMenuItem[]>("/main-menu");
    if (menu) mainMenuStore.defineMeinMenu(menu);
  }

  const handleRefresh = async (event: RefresherCustomEvent) => {
    mainMenuStore.clearMeinMenu();
    await getMainMenu();
    event.target.complete();
  };

  onMounted(async () => {
    if (isMainPage.value) await getMainMenu();
  });

  const chooseItem = (item: MainMenuItem) => {
    router.push({ name: "work-type", params: { workType: item.title } });
  };
</script>
