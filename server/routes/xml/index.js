const { Router } = require('express')
const RSS = require('rss')
const assert = require('http-assert')
const { SitemapStream, streamToPromise } = require('sitemap')

const { User, Option, Post, Note } = require('../../models')

const router = new Router()

router
  .get('/feed', async (req, res) => {
    const user = await User.findOne().select('created username mail url')
    assert(user, 400, '用户没有完成初始化')
    const option = await Option.find({
      $or: [
        {
          name: 'title'
        },
        {
          name: 'keywords'
        },
        {
          name: 'desc'
        },
        {
          name: 'createdDay'
        }
      ]
    }).select('name value')

    const parsed = {}
    option.forEach((item) => {
      parsed[item.name] = item.value
    })

    const posts = await Post.find({ hide: false })
      .sort({ created: -1 })
      .limit(2)
      .populate('categoryId')

    const notes = await Note.find({ hide: false })
      .sort({ created: -1 })
      .limit(2)

    const pn = [...posts, ...notes]

    const rightnow = new Date()
    const feed = new RSS({
      title: parsed.title,
      description: parsed.desc,
      blog: 'focus',
      feed_url: process.env.BASE_URL + '/rss.xml',
      site_url: process.env.BASE_URL,
      author: user.username,
      language: 'zh-cn',
      generator: 'Focus',
      copyright: `${rightnow.getFullYear()} ${
        user.username
      }, Powered by Focus.`,
      pubDate: rightnow,
      webMaster: user.username
    })
    pn.forEach((item) => {
      feed.item({
        title: item.title,
        url: `${process.env.BASE_URL}/${
          !item.slug ? `notes/${item.nid}` : `posts/${item.slug}`
        }`,
        author: user.username,
        categories: [
          item.categoryId ? item.categoryId.name : item.slug ? '' : '随记'
        ],
        custom_elements: [
          {
            content: item.text
          },
          { published: item.created.toString() },
          { updated: item.modified.toString() }
        ]
      })
    })
    const xml = feed.xml()
    res.set('Content-Type', 'text/xml')
    res.send(xml)
  })

  .get('/sitemap.xml', async (req, res) => {
    const posts = await Post.find({ hide: false })
      .sort({ created: -1 })
      .populate('categoryId')
    // TODO add other permalink (now only posts)
    const sitemap = new SitemapStream({ hostname: process.env.BASE_URL })
    sitemap.write({ url: '/', changefreq: 'daily', priority: 0.8 })
    posts.forEach((item) => {
      sitemap.write({
        url:
          process.env.BASE_URL +
          `/posts/${item.categoryId ? item.categoryId.name : 'null'}/${
            item.title
          }`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: item.modified
      })
    })
    sitemap.end()
    const buffer = await streamToPromise(sitemap)

    res.header('Content-Type', 'application/xml')
    res.send(buffer.toString())
  })

module.exports = router
