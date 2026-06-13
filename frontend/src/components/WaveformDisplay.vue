<template>
  <div class="rounded-xl p-4" :style="{ background: 'var(--bg-panel)' }">
    <h3 class="font-bold mb-2" :style="{ color: 'var(--accent-subtle)' }">实时波形</h3>
    <canvas ref="canvasRef" class="w-full h-40 rounded" :style="{ background: 'var(--canvas-bg)' }" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMorseStore } from '../store/morse'
import { MORSE_TABLE } from '../utils/morse-code'

const store = useMorseStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0

function getThemeColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  const w = canvas.width = canvas.offsetWidth * 2
  const h = canvas.height = canvas.offsetHeight * 2

  function draw() {
    const canvasBg = getThemeColor('--canvas-bg')
    const waveStroke = getThemeColor('--wave-stroke')
    const centerLine = getThemeColor('--center-line')

    ctx.fillStyle = canvasBg
    ctx.fillRect(0, 0, w, h)

    const morse = store.morseOutput || 'HELLO WORLD'
    const dd = store.dotDuration
    let x = 20

    ctx.strokeStyle = waveStroke
    ctx.lineWidth = store.theme === 'high-contrast' ? 5 : 3
    ctx.beginPath()

    const tokens = morse.split(' ')
    for (const token of tokens) {
      if (token === '/') { x += dd * 4; continue }
      for (const sym of token) {
        const len = sym === '.' ? dd : dd * 3
        ctx.moveTo(x, h / 2)
        ctx.lineTo(x + len * 2, h / 2)
        ctx.moveTo(x, h / 2)
        ctx.lineTo(x + len, h / 4)
        ctx.lineTo(x + len * 2, h / 2)
        x += (len + dd) * 2
      }
      x += dd * 4
    }
    ctx.stroke()

    ctx.strokeStyle = centerLine
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()
    ctx.setLineDash([])

    animId = requestAnimationFrame(draw)
  }
  draw()
})

onUnmounted(() => cancelAnimationFrame(animId))
</script>
