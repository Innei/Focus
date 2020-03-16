import path from 'path'
import fs from 'fs'

import Post from '~/models/Post.js'
import Note from '~/models/Note.js'
import Category from '~/models/Category.js'
import Option from '~/models/Option.js'

const base = path.resolve(__dirname, './../uploads/md')

async function getFiles(): Promise<string[]> {
  const dir = await fs.promises.opendir(base)
  const files: string[] = []
  for await (const dirent of dir) {
    files.push(dirent.name)
  }
  // await dir.close()
  return files
}

async function readFile(file: string) {
  const pwd = path.resolve(base, file)
  const raw = fs.readFileSync(pwd, { encoding: 'utf8' })
  // const parttenYAML = raw.matchAll(/---(.*?)---(.*)$/gs)
  const parts = /-{3,}\n(.*?)-{3,}\n*(.*)$/gms.exec(raw)
  if (!parts) {
    return null
  }
  const parttenYAML = parts[1]
  const text = parts.pop()
  const parseYAML = parttenYAML.split('\n')

  const tags = [] as string[]
  const categories = [] as string[]

  let cur: 'cate' | 'tag' | null = null
  const meta: any = parseYAML.reduce((meta, current) => {
    const splitPart = current
      .trim()
      .split(':')
      .filter((item) => item.length)
    const sp =
      splitPart.length >= 2
        ? [
            splitPart[0],
            splitPart
              .slice(1)
              .filter((item) => item.length)
              .join(':')
              .trim()
          ]
        : [splitPart[0]]

    // console.log(sp)
    if (sp.length === 2) {
      const [property, value] = sp
      if (['date', 'updated'].includes(property)) {
        meta[property] = new Date(value.trim())
      } else if (['categories:', 'tags:'].includes(property)) {
        cur = property === 'categories:' ? 'cate' : 'tag'
      } else meta[property] = value.trim()
    } else {
      const item = current.trim().replace(/^\s*-\s*/, '')

      if (['', 'tags:', 'categories:'].includes(item)) {
        cur = item === 'categories:' ? 'cate' : 'tag'
        return meta
      }
      if (cur === 'tag') {
        tags.push(item)
      } else {
        categories.push(item)
      }
    }
    return meta
  }, {})

  meta.categories = categories
  meta.tags = tags
  meta.slug = file
    .split('.')
    .slice(0, -1)
    .join('.')
  return { meta, text }
}

interface ParsedModel {
  meta: {
    title: string
    updated: Date
    date: Date
    categories: Array<string>
    tags: Array<String>
    slug: string
  }
  text: string
}

const syncDBCount = async (model: 'Post' | 'Note') => {
  switch (model) {
    case 'Post':
      await Option.updateOne(
        {
          name: 'count'
        },
        {
          $inc: {
            'value.postCount': 1
          }
        }
      )

      break
    case 'Note':
      await Option.updateOne(
        {
          name: 'count'
        },
        {
          $inc: {
            'value.noteCount': 1
          }
        }
      )

      break
    default:
      break
  }
}
async function store2DB(data: ParsedModel, model: 'Post' | 'Note' = 'Post') {
  const { meta, text } = data

  const { title, slug, updated, date, categories } = meta
  if (model === 'Post') {
    const category = categories.length > 0 ? categories[0] : undefined

    const findCate = category
      ? await Category.findOne({
          $or: [{ name: category }, { slug: category }]
        })
      : undefined

    const categoryId = !findCate
      ? (
          await Category.create({
            slug: category,
            name: category
          })
        )._id
      : findCate._id

    await Post.create({
      title,
      created: date,
      modified: updated,
      text,
      slug,
      categoryId
    })

    await Category.updateOne(
      {
        _id: categoryId
      },
      { $inc: { count: 1 } }
    )
  } else {
    const count = await Option.findOne({ name: 'count' })
    const value = count.value
    const nid = value.noteCount + 1
    await Note.create({
      title,
      created: date,
      modified: updated,
      text,
      nid
    })
  }
  await syncDBCount(model)
  return { ok: 1 }
}

async function start(model: 'Post' | 'Note') {
  const files = await getFiles()
  const categoriesSet = new Set<string>()
  // const tagsSet = new Set<string>()

  for (const file of files) {
    const parsed: ParsedModel = (await readFile(file)) as ParsedModel
    if (!parsed) {
      continue
    }
    const { categories /*tags*/ } = parsed.meta
    categories.map((item) => {
      categoriesSet.add(item)
      return item
    })
    await store2DB(parsed, model ?? 'Post')
  }
}
async function test() {
  const mongoose = require('mongoose')
  const consola = require('consola')
  mongoose
    .connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/Focus', {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(
      () => {
        consola.success({ message: 'Connected to db, ready...' })
        consola.ready({ message: 'Server is started.', badge: true })
      },
      (err) => {
        consola.error(err)

        consola.error('Failed to connect to db. Try again.')
      }
    )
  await start('Note')
}
// test()
export default start
