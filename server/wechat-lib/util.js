import xml2js from 'xml2js'

export const xmlTojs = xml => new Promise((resolve, reject) => {
  xml2js.parseString(xml, {trim: true}, (err, content) => {
    if(err) reject(err)
    else resolve(content)
  })
})