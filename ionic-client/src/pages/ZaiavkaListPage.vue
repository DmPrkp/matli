<template>
  <ion-page v-if="route.name === 'zaiavka-list'">
    <ion-content>
      <ion-refresher
        slot="fixed"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content />
      </ion-refresher>
      <div class="ion-padding">
        <ion-item-divider>
          <ion-title>
            {{ $t("pages.zaiavka_list.title") }}
          </ion-title>
        </ion-item-divider>
      </div>
      <ion-list>
        <ion-item
          v-for="zaiavka in materialRequests"
          :key="zaiavka.id"
        >
          <ion-grid>
            <ion-row
              color="secondary"
              @click="openItem(zaiavka.id)"
              style="cursor: pointer"
            >
              <ion-col
                size="5"
                class="ion-align-items-start"
              >
                {{ $t("pages.zaiavka_list.item_title") }}
                {{ zaiavka.id }}
              </ion-col>
              <ion-col
                size="7"
                class="ion-align-items-start"
              >
                {{ $t("pages.zaiavka_list.from") }}
                {{ toLocaleDate(zaiavka.createdAt) }}
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
  <router-view v-else />
</template>

<script setup lang="ts">
  import Zaiavka from "@/models/zaiavka";
  import { useZaiavkaStore } from "@/store/zaiavka";
  import { StoredMaterialRequestDTO } from "@/types/dto";
  import { RefresherCustomEvent } from "@ionic/vue";
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  const store = useZaiavkaStore();
  const route = useRoute();
  const router = useRouter();

  function toLocaleDate(date: string) {
    const l = new Date(Date.parse(date));
    return l.toLocaleString(route.params.locale);
  }

  function openItem(id: StoredMaterialRequestDTO["id"]) {
    router.push({ name: "zaiavka", params: { zaiavka: id } });
  }

  const materialRequests = ref<StoredMaterialRequestDTO[]>([]);

  onMounted(async () => {
    materialRequests.value = store.getAll();

    if (materialRequests.value.length) return;

    const materialRequestsDTO = await Zaiavka.findAll();
    store.define(materialRequestsDTO);
    materialRequests.value = store.getAll();
  });

  // ionic functions
  async function handleRefresh(event: RefresherCustomEvent) {
    event.target.complete();
  }
</script>
