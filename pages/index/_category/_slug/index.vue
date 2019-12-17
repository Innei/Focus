<script>
export default {
  asyncData({ redirect, route }) {
    const { category, slug } = route.params
    redirect(encodeURI(`/posts/${category}/${slug}`))
  }
}
</script>
