<script>
export default {
  asyncData({ error }) {
    error({
      statusCode: 404,
      message: '页面不存在'
    })
  }
}
</script>

<style></style>
