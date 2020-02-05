<template>
  <Basic>
    <Loading v-show="!data" />
    <Note v-if="data" :data="data" />

    <div :class="{ 'move-top': showSwiper }" class="btn-wrap">
      <Btn
        v-if="next"
        :class="{ show: btnShow }"
        class="right"
        @click.native="$router.push(`/notes/${next.nid}`)"
      >
        <i class="el-icon-arrow-right"></i>
      </Btn>
      <Btn
        :class="{ show: btnShow }"
        class="right item"
        @click.native="showSwiper = !showSwiper"
        ><i class="el-icon-more"></i
      ></Btn>
      <Btn
        v-if="prev"
        :class="{ show: btnShow }"
        class="left"
        @click.native="$router.push(`/notes/${prev.nid}`)"
        ><i class="el-icon-arrow-left"></i
      ></Btn>
    </div>
    <transition name="slide-down">
      <div v-show="showSwiper" id="swiper" class="overlay">
        <client-only>
          <Swiper ref="swiper" class="swiper">
            <Slide
              v-for="i in list"
              :key="i._id"
              :date="new Date(i.created)"
              :title="i.title"
              :is-active="
                $route.params.id == i.nid || $route.params.id === i._id
              "
              @click.native="handleTo(i.nid)"
            />
          </Swiper>
        </client-only>
      </div>
    </transition>
  </Basic>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mdit from 'markdown-it'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Loading'
import Rest from '~/api/rest'
import Notes from '~/api/notes'
import Note from '~/components/Note'
import Btn from '~/components/Note/components/btn'
import Swiper from '~/components/Note/components/Swiper'
import Slide from '~/components/Note/components/Swiper/slide'

const md = new Mdit({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  components: {
    Basic,
    Loading,
    Note,
    Btn,
    Swiper,
    Slide
  },
  async asyncData({ app, params, redirect }) {
    // valid params.id
    const isNum = /^\d*$/.test(params.id)
    if (!isNum) {
      return redirect('/404')
    }
    try {
      const { data, prev, next } = await Rest(
        app.$axios,
        'getOne',
        'Note'
      )(params.id)
      const list = await Notes(app.$axios, 'getList')(params.id)
      const raw = data.text
      data.text = md.render(data.text)
      return {
        data,
        prev,
        next,
        list: list.data.reverse(),
        raw
      }
    } catch (e) {}
  },
  data() {
    return {
      data: null,
      list: null,
      showSwiper: false,

      currentY: 0
    }
  },
  mounted() {
    if (this.data) {
      this.setStatus(false)
    }
  },
  head() {
    return {
      title: this.data.title + ' - ' + this.config.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.raw?.replace(/\s/gi, '').slice(0, 200)
        },
        {
          hid: 'site_name',
          name: 'og:site_name',
          content: this.config.title
        },
        {
          hid: 'title',
          name: 'og:title',
          content: this.data.title
        }
      ]
    }
  },
  methods: {
    ...mapActions('Navigation', ['setStatus']),
    handleTo(nid) {
      this.$router.push('/notes/' + nid)
    }
  },
  computed: {
    ...mapGetters(['navActive', 'config', 'scroll']),
    btnShow() {
      return this.scroll === 'up'
    }
  },
  watch: {
    showSwiper(val) {
      if (val) {
        this.$refs.swiper.$refs.swiper.swiper.slideTo(
          this.list.findIndex(
            (item) =>
              item.nid === parseInt(this.$route.params.id) ||
              item._id === this.$route.params.id
          ),
          500
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1) 6%, transparent);
  // backdrop-filter: blur(5px);
}
#swiper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.5s;
  transform: translateY(0);
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(100%);
}
</style>
