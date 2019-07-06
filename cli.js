#!/usr/bin/env node
const fs = require('fs');
const yaml = require('js-yaml')
const program = require('commander')
const { createCanvas, loadImage } = require('canvas')



const htmlFrontMatter = fs.readFileSync('./_layouts/meme.html', 'utf8')



function drawTextBG (ctx, location, txt, opts = {}) {
  opts = Object.assign({
    'font': 'Courier',
    'fontSize': '15',
    'fontModifiers': '',
    'shadowBlur': 4,
    'shadowColor': 'white',
    'backgroundColor': false,
    'fontColor': 'black',
    'textBaseline': 'top',
    'textAlign': 'center',
    'border': 0
  }, opts)
  ctx.save()

  const messages = txt.split('\\n')

  const x = Math.round(ctx.canvas.width / 2)
  let y = 0 + opts.border
  if (location == 'bottom') {
    y = (ctx.canvas.height - (opts.fontSize * messages.length)) - opts.border
  }

  ctx.font = `${opts.fontModifiers} ${opts.fontSize}px ${opts.font}`

  const margin = 5
  const fontSize = parseInt(opts.font, 10) * 1.1
  const width = ctx.measureText(txt).width + (2 * margin)
  const height = fontSize
  let rectX
  let rectY
  switch (opts.textAlign) {
    case 'center':
      rectX = x - (width / 2)
      rectY = y - (height * 0.05)
      break
    default:
      rectX = x
      rectY = y - (height * 0.05)
  }

  ctx.textBaseline = opts.textBaseline
  ctx.textAlign = opts.textAlign
  if (opts.backgroundColor) {
    ctx.fillStyle = opts.backgroundColor
    ctx.fillRect(rectX, rectY, width, height * 1.1)
  }

  ctx.shadowColor = opts.shadowColor
  ctx.shadowBlur = opts.shadowBlur

  ctx.fillStyle = opts.fontColor

  for (const message of messages) {
    ctx.fillText(message, x, y)
    y += opts.fontSize
  }

  ctx.restore()
}



function ggw (canvas, img, warrenImage, warrenQuote) {
  const ctx = canvas.getContext('2d')
  const fontSize = 40
  const border = 10
  const maxWidth = 750
  const imageWidth = warrenImage.width
  const imageHeight = warrenImage.height

  ctx.canvas.width = Math.min(imageWidth, maxWidth)

  const imageRatio = ctx.canvas.width / imageWidth
  ctx.canvas.height = imageHeight * imageRatio

  ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)

  drawTextBG(ctx, 'top', warrenQuote.top, {
    'fontSize': fontSize * imageRatio,
    'fontModifiers': 'bold',
    'shadowBlur': 10 * imageRatio,
    'shadowColor': warrenImage.fontShadowColor,
    'fontColor': warrenImage.fontColor,
    'border': border
  })
  drawTextBG(ctx, 'bottom', warrenQuote.bottom, {
    'fontSize': fontSize * imageRatio,
    'fontModifiers': 'bold',
    'shadowBlur': 10 * imageRatio,
    'shadowColor': warrenImage.fontShadowColor,
    'fontColor': warrenImage.fontColor,
    'border': border
  })

}





program.version('0.0.1')

const images = yaml.safeLoad(fs.readFileSync('_data/images.yaml', 'utf8'));
const quotes = yaml.safeLoad(fs.readFileSync('_data/quotes.yaml', 'utf8'));


program
  .command('images')
  .description('build the images')
  .action(async function (options) {
    for (let imageIndex in images) {
      const image = images[imageIndex]
      const imagePath = `./assets/images/${image['image']}`
      const imageObject = await loadImage(imagePath)
      for (let quoteIndex in quotes) {
        const quote = quotes[quoteIndex]
        const newImageName = image['image'].substr(0, image['image'].lastIndexOf('.')) + '.png'
        const fullPath = `/assets/ew/${quoteIndex}_${newImageName}`
        const finalPath = __dirname + fullPath
        console.log(`Building ${fullPath}`)
        const canvas = createCanvas(200, 200)
        ggw(canvas, imageObject, image, quote)
        const out = fs.createWriteStream(finalPath)
        const stream = canvas.createPNGStream()
        stream.pipe(out)
        out.on('finish', () =>  console.log(`The PNG file was created at ${finalPath}`))
      }
    }
  })




program
  .command('pages')
  .description('build the pages')
  .action(async function (options) {
    for (let imageIndex in images) {
      const image = images[imageIndex]
      const imagePath = `./assets/images/${image['image']}`
      const imageObject = await loadImage(imagePath)
      for (let quoteIndex in quotes) {
        const quote = quotes[quoteIndex]
        const newImageBase = image['image'].substr(0, image['image'].lastIndexOf('.'))
        const fullImagePath = `/assets/ew/${quoteIndex}_${newImageBase}.png`
        const fullHtmlPath = `/_memes/${quoteIndex}-${imageIndex}.html`
        const finalHtmlPath = `/${quoteIndex}-${imageIndex}.html`
        const finalPath = __dirname + fullHtmlPath
        const quoteText = quote.top.replace('\\n', ' ') + ' ' + quote.bottom.replace('\\n', ' ')
        console.log(`Building ${finalPath}`)

        let pageSpecificFrontMatter = htmlFrontMatter.replace('{{ imagePath }}', fullImagePath)
        pageSpecificFrontMatter = pageSpecificFrontMatter.replace('{{ quoteSource }}', quote.source)
        pageSpecificFrontMatter = pageSpecificFrontMatter.replace('{{ quoteText }}', quoteText)
        pageSpecificFrontMatter = pageSpecificFrontMatter.replace('{{ htmlPath }}', finalHtmlPath)



        fs.writeFile(finalPath, pageSpecificFrontMatter, function (err) {
          if (err) {
            return console.log(err)
          }
          console.log(`Saved ${finalPath}`)
        })
      }
    }
  })



program.parse(process.argv)
