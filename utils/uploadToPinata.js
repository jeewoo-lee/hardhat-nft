const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecrete = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecrete)

async function storeImages(imagesFilePaths) {
  const fullImagesPath = path.resolve(imagesFilePaths)
  const files = fs.readdirSync(fullImagesPath)
  let responses = []
  console.log("Uploading to IPFS! (Pinata)")
  for (fileIndex in files) {
    console.log(`Working on ${fileIndex}...`)
    const readableStreamFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
    try {
      const response = await pinata.pinFileToIPFS(readableStreamFile) //pinata stuff
      responses.push(response)
    } catch (e) {
      console.log(e)
    }
  }
  return { responses, files }
}

async function storeMetaData(metaData) {
  try {
    const response = await pinata.pinJSONToIPFS(metaData)
    return response
  } catch (error) {
    console.log(error)
  }
  return null
}

module.exports = { storeImages, storeMetaData }
