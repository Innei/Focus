<template>
  <nuxt-link :to="link" class="post-item-card">
    <div class="card-header">
      <div class="post-cover-wrapper">
        <progressive-background
          :placeholder="this.img"
          :src="this.img"
          :blur="0"
        />
      </div>
      <div class="tag small">
        {{ type }}
      </div>

      <div class="text-shade"></div>
    </div>

    <div class="card-body">
      <!-- meta -->
      <div class="info-list"></div>
      <h3 class="title">
        {{ item.title }}
      </h3>
      <p class="desc small">
        {{ item.summary }}
      </p>
    </div>
  </nuxt-link>
</template>

<script>
import { randomStr } from '~/utils'
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator(val) {
        return ['post', 'note'].includes(val)
      }
    }
  },
  computed: {
    img() {
      return (
        this.item?.options?.img ||
        `https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302&r=${randomStr()}`
      )
    },
    link() {
      switch (this.type) {
        case 'post': {
          return `/posts/${
            this.item.categoryId ? this.item.categoryId.slug : 'null'
          }/${this.item.slug}`
        }
        case 'note': {
          return `/notes/${this.item.nid}`
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.post-item-card {
  font-family: $Heiti;
  overflow: hidden;
  display: block;
  text-decoration: none;
  color: var(--black);
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  background-color: var(--white);
  border: 3px solid var(--gwhite);
  cursor: pointer;
  margin-bottom: 30px;
  transition: border 0.5s ease-out;

  &:hover {
    border: 3px solid var(--shallow);

    .post-cover-wrapper {
      transform: scale(1.1);
    }
  }
}
.card-header {
  position: relative;
  min-height: 13rem;
  overflow: hidden;
}
.post-cover-wrapper {
  z-index: 1;
  background-color: #9c9c9c;
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.5s;
}
.text-shade {
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.396078));
}
.tag {
  position: absolute;
  top: -17px;
  right: -6px;
  background-color: #141414;
  color: #fff;
  padding: 25px 20px 8px 17px;
  border-radius: 10px;
  z-index: 2;
}
.card-body {
  position: relative;
  padding: 20px 25px;
  min-height: 7rem;

  > * {
    line-height: 1.5;
  }
}
</style>
