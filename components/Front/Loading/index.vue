<template>
  <div id="loader-wrapper">
    <div class="loader-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin:auto;display:block;visibility: unset"
        width="78px"
        height="78px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="50" cy="33.847" r="15" fill="#e15b64">
          <animate
            attributeName="cy"
            dur="0.9803921568627451s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
            keyTimes="0;0.5;1"
            values="25;75;25"
          />
        </circle>
      </svg>
      <div class="text">
        数据马上就来.....
      </div>
    </div>
  </div>
</template>

<style scoped>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}
#loader-wrapper .loader-container {
  text-align: center;
  width: 100%;
}
</style>
