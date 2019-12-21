<template>
  <div class="btn">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  position: fixed;
  z-index: 2;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.01),
    2px 3px 5px 1px rgba(0, 0, 0, 0.06), 0 9px 14px 0 rgba(243, 232, 232, 0.2);
  transition: box-shadow 0.5s, transform 0.5s;
  &:active {
    transform: scale(0.92);
  }
  &:hover {
    box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.01);
  }
}
</style>
