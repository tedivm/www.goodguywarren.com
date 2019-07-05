---
---

const images = {{ site.data.images | jsonify }}
const quotes = {{ site.data.quotes | jsonify }}


function sample (passedArray) {
  return passedArray[Math.floor(Math.random() * passedArray.length)];
}

function sampleIndex (passedArray) {
  return Math.floor(Math.random() * passedArray.length)
}


function drawTextBG (ctx, location, txt, opts = {}) {

  opts = Object.assign({
    'font': 'Courier',
    'fontSize': '15',
    'shadowBlur': 4,
    'shadowColor': 'white',
    'backgroundColor': false,
    'fontColor': 'black',
    'textBaseline': 'top',
    'textAlign': 'center'
  }, opts)
  ctx.save()

  const messages = txt.split('\\n')


  const x = Math.round(ctx.canvas.width / 2)
  let y = 0
  if (location == 'bottom') {
    y = ctx.canvas.height - (opts.fontSize * messages.length)
  }

  ctx.font = `${opts.fontSize}px ${opts.font}`

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

function ggw (canvas, source, image=false, quote=false) {
  const ctx = canvas.getContext('2d')
  const fontSize = 40

  if (!image) {
    image = sampleIndex(images)
  }
  if (!quote) {
    quote = sampleIndex(quotes)
  }

  const warrenImage = images[image]
  const warrenQuote = quotes[quote]

  const maxWidth = 750
  const imageWidth = warrenImage.width
  const imageHeight = warrenImage.height

  ctx.canvas.width = Math.min(imageWidth, maxWidth)

  const imageRatio = ctx.canvas.width / imageWidth
  ctx.canvas.height = imageHeight * imageRatio

  source.innerHTML = `<a href="${warrenQuote.source}">Source</a>`

  const img = new Image()
  img.width = ctx.canvas.width
  img.height = ctx.canvas.height
  img.onload = function () {
    ctx.drawImage(img, 0, 0)

    drawTextBG(ctx, 'top', warrenQuote.top, {
      'fontSize': fontSize * imageRatio,
      'shadowBlur': 10 * imageRatio,
      'shadowColor': 'blue',
      'fontColor': 'white'
    })
    drawTextBG(ctx, 'bottom', warrenQuote.bottom, {
      'fontSize': fontSize * imageRatio,
      'shadowBlur': 10 * imageRatio,
      'shadowColor': 'blue',
      'fontColor': 'white'
    })
  }
  img.src = `/assets/images/${warrenImage.image}`
  return [image, quote]
}
