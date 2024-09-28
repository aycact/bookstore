const tesseract = require('node-tesseract-ocr')

const img = './IMG20211004203856.jpg'

const config = {
  lang: 'eng',
  oem: 1,
  psm: 3,
}

str='095203000441'

tesseract
  .recognize(img, config)
  .then((text) => {
    console.log('Compare:', text.includes(str))
  })
  .catch((error) => {
    console.log(error.message)
  })
