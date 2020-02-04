import Mdit from 'markdown-it'
import prism from 'markdown-it-prism'
import emoji from 'markdown-it-emoji'

const defaultConfig = {
  html: false,
  linkify: true,
  typographer: true
}
class Markdown {
  constructor(config = defaultConfig) {
    config = { ...defaultConfig, config }
    this.md = new Mdit(config).use(prism).use(emoji)
  }

  renderText(str) {
    return this.md.render(str)
  }
}
export default Markdown
