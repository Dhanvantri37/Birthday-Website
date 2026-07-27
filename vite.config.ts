import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Local helper to copy local image if present
const srcImg = 'C:/Users/Owner/.gemini/antigravity-ide/brain/ba506f04-cfc7-46ba-8111-3bc985ad43e1/media__1785155331697.png'
const destDir = path.resolve(__dirname, 'public/photos')
const destImg = path.join(destDir, 'krishna.png')

try {
  if (process.env.NODE_ENV !== 'production' && fs.existsSync(srcImg)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    if (!fs.existsSync(destImg)) {
      fs.copyFileSync(srcImg, destImg)
    }
  }
} catch {
  // Ignore in build
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
