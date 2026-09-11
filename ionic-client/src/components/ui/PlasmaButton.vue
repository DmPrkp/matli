<template>
  <!--
    <button> корневой, без обёртки: type, disabled и @click родителя Vue вешает
    на корень, и с div-обёрткой они уходили бы на неё, а не на кнопку.
  -->
  <button
    class="plasma_btn"
    type="button"
  >
    <slot />
  </button>
</template>

<style scoped>
  .plasma_btn {
    position: relative;
    display: inline-block;
    min-width: 130px;
    height: 40px;
    padding: 0 25px;
    border: none;
    border-radius: 5px;
    overflow: hidden;
    color: #fff;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    background: radial-gradient(
      circle,
      rgba(247, 150, 192, 1) 0%,
      rgba(118, 174, 241, 1) 100%
    );
    box-shadow:
      inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
      7px 7px 20px 0px rgba(0, 0, 0, 0.1),
      4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .plasma_btn:before {
    position: absolute;
    content: "";
    display: inline-block;
    top: -180px;
    left: 0;
    width: 30px;
    height: 100%;
    background-color: #fff;
    animation: shiny-btn 5s ease-in-out infinite;
  }

  .plasma_btn:hover {
    opacity: 0.7;
  }

  .plasma_btn:active {
    box-shadow:
      4px 4px 6px 0 rgba(255, 255, 255, 0.3),
      -4px -4px 6px 0 rgba(116, 125, 136, 0.2),
      inset -4px -4px 6px 0 rgba(255, 255, 255, 0.2),
      inset 4px 4px 6px 0 rgba(0, 0, 0, 0.2);
  }

  /* outline: none без замены оставлял клавиатуру без видимого фокуса. */
  .plasma_btn:focus-visible {
    outline: 2px solid rgba(118, 174, 241, 1);
    outline-offset: 2px;
  }

  .plasma_btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  @keyframes shiny-btn {
    0% {
      transform: scale(0) rotate(45deg);
      opacity: 0;
    }
    80% {
      transform: scale(0) rotate(45deg);
      opacity: 0.5;
    }
    81% {
      transform: scale(4) rotate(45deg);
      opacity: 1;
    }
    100% {
      transform: scale(50) rotate(45deg);
      opacity: 0;
    }
  }
</style>
