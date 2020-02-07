<template>
  <div id="footer">
    <div class="container flex lr">
      <p>
        Stay Hungry. Stay Foolish. | &copy; 2019 - {{ year }}
        <a href="https://innei.ren" target="_blank">Innei.</a>
        All rights reserved.
      </p>
      <p>
        <a href="/feed">RSS <i class="el-icon-coffee-cup"></i></a> |
        <a href="/sitemap.xml">站点地图 <i class="el-icon-map-location"></i></a>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
<style lang="scss" scoped>
#footer {
  padding: 2rem 0;
  // text-align: center;
  left: 0;
  right: 0;
  background: var(--gwhite);
  color: #666;
  font-size: 12px;
}
</style>
