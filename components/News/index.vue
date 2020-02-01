<template>
  <section class="news">
    <div class="news-header">
      <div class="title">
        <div class="icon">
          <slot name="icon" />
        </div>
        <div class="text">{{ title }}</div>
      </div>
      <div class="more-icon">
        <nuxt-link :to="to">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"
            />
          </svg>
        </nuxt-link>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.news {
  margin-bottom: 36px;
}
.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    color: var(--black);
    font-weight: 700;
    position: relative;
    display: flex;
    align-items: center;
    border-left: 2px solid map-get($map: $material, $key: 'main');
    .icon {
      top: 0;
      left: 0;
      padding: 0.5rem 1em;
      border-radius: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.content {
  padding: 1rem;
}
</style>
