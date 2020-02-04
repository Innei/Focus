<script>
import { avatarFromMail, isMail } from '~/utils'
export default {
  data() {
    return {
      comment: {
        text: '',
        author: '',
        url: '',
        mail: ''
      }
    }
  },
  computed: {
    avatar() {
      return this.comment.mail && isMail(this.comment.mail)
        ? avatarFromMail(this.comment.mail)
        : null
    }
  }
}
</script>
