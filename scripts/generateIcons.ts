/* eslint-env node */

import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const iconFile = path.join(__dirname, `..`, `assets`, `clerkent.png`)
const destination = path.join(__dirname, `..`, `generated`)
const iconSizes = [16, 32, 48, 64, 128]


const init = async () => {
  try {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination)
    }

    for(const iconSize of iconSizes){
      console.log(`🔨  generating ${iconSize} favicon`)
      await sharp(iconFile)
        .resize(iconSize)
        .png()
        .toFile(path.join(destination, `favicon-${iconSize}.png`))
    }
    console.log(`✅  favicons generated`)
  } catch (error) {
    console.error(error)
  }
}

init()