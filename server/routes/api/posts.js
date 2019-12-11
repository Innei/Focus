const { Router } = require('express')
const assert = require('http-assert')
const Post = require('../../models/Post')
const router = Router()

router
  .get('/', async (req, res) => {
    res.send({
      text: `<script async defer src="https://buttons.github.io/buttons.js"></script>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
## 介绍

这里是 yiny. 来自浙江，是个学习中的前<del>后</del>端工程师。通过这个~~技术~~博客记录我的学习过程和折腾过程。很高兴能认识各位大佬。

另外我还有一个生活博客，记录自己的生活经历，生活感想以及乱七八糟的想法。移步 [静之森](https://innei.ren)

## 关于博客

这个博客其实是个没有技术的~~技术~~博客，还请路过的大佬们多多指教。これからも、よろしくお願いします。

## 域名来源

人间浮躁，尘世喧嚣。不曾想过去桃花源与世界隔绝的人间圣地，只想拥有一片属于自己的宁境。

不曾去过森林，却想在森林中聆听大自然的声音，享受这一片宁静。

shizuri 来自日语「しずかなもり」，意思是宁静的森林。

shizuri.net于2019-02-20号正式启用，作为此博客的新域名。

这样可以找到我：

<a href="https://twitter.com/_oQuery?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false"></a>     <a class="github-button" href="https://github.com/Innei" data-show-count="true" aria-label="Follow @Innei on GitHub">Follow @Innei</a>

## 一言

<script src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto" defer></script>
<p id="hitokoto">:D 获取中...</p>
`
    })
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '不正确的请求')
    const r = await Post.findById(id)
    res.send(r)
  })
  .post('/', async (req, res) => {
    const body = req.body
    assert(body && body != '{}', 400, '空的请求体')
    const {
      title = '未命名文章',
      text = '',
      status,
      categoryId,
      authorId
    } = body

    const { slug = title } = body

    const r = await Post.create({
      title,
      text,
      status,
      categoryId,
      authorId,
      slug
    })

    res.send(r)
  })

module.exports = router
