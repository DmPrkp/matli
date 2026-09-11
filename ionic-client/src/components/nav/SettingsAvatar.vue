<template>
  <ion-button
    class="settings_trigger"
    fill="clear"
    shape="round"
    :aria-label="$t('pages.settings.open')"
    :title="$t('pages.settings.open')"
  >
    <ion-avatar class="settings_avatar">
      <ion-icon
        class="settings_person"
        :icon="person"
      />
      <span class="settings_badge">
        <ion-icon :icon="settingsSharp" />
      </span>
    </ion-avatar>
  </ion-button>
</template>

<script setup lang="ts">
  /**
   * Вход в настройки. Шестерёнка на значке подсказывает, что по аватару можно
   * кликнуть: сам по себе кружок с человечком читается как картинка.
   * Клик слушает App.vue — модалка живёт там, а не в шапке.
   */
  import { IonAvatar, IonIcon } from "@ionic/vue";
  import { person, settingsSharp } from "ionicons/icons";
</script>

<style scoped>
  .settings_trigger {
    --padding-start: 4px;
    --padding-end: 4px;
    /*
     * У round-кнопки внутренний .button-native скруглён почти в круг и режет
     * всё по overflow: hidden — шестерёнка в углу аватара срезалась по дуге.
     * Выпускаем её наружу, а ripple гасим: без обрезки он вылезал бы за круг.
     * Отклик на наведение остаётся — это фон, он и так скруглён.
     */
    --overflow: visible;
    --ripple-color: transparent;
    height: auto;
  }

  .settings_avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    /* Полупрозрачный цвет текста: темнее фона в светлой теме, светлее в тёмной. */
    background: rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.12);
  }

  .settings_person {
    font-size: 20px;
    color: var(--ion-text-color, #000);
  }

  .settings_badge {
    position: absolute;
    right: -3px;
    bottom: -3px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--ion-color-secondary);
    color: var(--ion-color-secondary-contrast, #fff);
    /* Кольцо цвета фона «вырезает» значок из аватара. */
    box-shadow: 0 0 0 2px var(--ion-background-color, #fff);
  }

  .settings_badge ion-icon {
    font-size: 11px;
  }
</style>
