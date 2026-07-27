import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Copy uploaded Krishna image into public/photos/krishna.png
const srcImg = 'C:/Users/Owner/.gemini/antigravity-ide/brain/ba506f04-cfc7-46ba-8111-3bc985ad43e1/media__1785155331697.png'
const destDir = path.resolve(__dirname, 'public/photos')
const destImg = path.join(destDir, 'krishna.png')

try {
  if (fs.existsSync(srcImg)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    fs.copyFileSync(srcImg, destImg)
    console.log('Successfully copied uploaded Krishna image to public/photos/krishna.png')
  }
} catch (e) {
  console.error('Error copying Krishna image:', e)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
