<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Quiz Panel -->
    <div class="rounded-xl p-4" :style="{ background: 'var(--bg-panel)' }">
      <h3 class="font-bold mb-3" :style="{ color: 'var(--accent-subtle)' }">听音/看码 猜字符</h3>
      <div v-if="!store.quizChar" class="text-center py-8">
        <button @click="store.generateQuiz()" class="px-6 py-3 rounded-lg text-lg transition-colors"
          :style="{ background: 'var(--accent)', color: 'var(--accent-text)' }">
          开始训练
        </button>
      </div>
      <div v-else class="flex flex-col items-center gap-4">
        <div class="text-8xl font-bold" :style="{ color: 'var(--accent)' }">{{ store.quizChar }}</div>
        <button @click="store.playMorse(MORSE_TABLE[store.quizChar])" :disabled="store.isPlaying"
          class="px-4 py-2 rounded transition-colors disabled:opacity-50"
          :style="{ background: 'var(--action-bg)', color: '#fff' }">
          {{ store.isPlaying ? '播放中...' : '🔊 播放音频' }}
        </button>
        <div class="text-2xl font-mono" :style="{ color: 'var(--morse-text)' }">{{ MORSE_TABLE[store.quizChar] }}</div>
        <input v-model="store.userAnswer" @keyup.enter="store.checkAnswer()"
          class="rounded px-4 py-2 text-center text-xl w-48"
          :style="{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }"
          placeholder="输入莫尔斯码" />
        <button @click="store.checkAnswer()" class="px-6 py-2 rounded transition-colors"
          :style="{ background: 'var(--accent)', color: 'var(--accent-text)' }">
          确认
        </button>
      </div>
    </div>

    <!-- Score & History -->
    <div class="rounded-xl p-4 flex flex-col gap-3" :style="{ background: 'var(--bg-panel)' }">
      <div class="flex justify-between items-center">
        <h3 class="font-bold" :style="{ color: 'var(--accent-subtle)' }">训练统计</h3>
        <button @click="store.resetScore()" class="text-sm hover:underline"
          :style="{ color: 'var(--reset-color)' }">重置</button>
      </div>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded p-2" :style="{ background: 'var(--bg-card)' }">
          <div class="text-2xl font-bold" :style="{ color: 'var(--stat-correct)' }">{{ store.score.correct }}</div>
          <div class="text-xs" :style="{ color: 'var(--text-muted)' }">正确</div>
        </div>
        <div class="rounded p-2" :style="{ background: 'var(--bg-card)' }">
          <div class="text-2xl font-bold" :style="{ color: 'var(--stat-incorrect)' }">{{ store.score.total - store.score.correct }}</div>
          <div class="text-xs" :style="{ color: 'var(--text-muted)' }">错误</div>
        </div>
        <div class="rounded p-2" :style="{ background: 'var(--bg-card)' }">
          <div class="text-2xl font-bold" :style="{ color: 'var(--stat-rate)' }">
            {{ store.score.total ? Math.round(store.score.correct / store.score.total * 100) : 0 }}%
          </div>
          <div class="text-xs" :style="{ color: 'var(--text-muted)' }">正确率</div>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto max-h-64">
        <div v-for="h in store.history.slice(0, 20)" :key="h.id"
          class="flex justify-between rounded p-2 mb-1 text-sm"
          :style="{
            background: 'var(--bg-card)',
            borderLeft: h.correct ? '4px solid var(--correct)' : '4px solid var(--incorrect)',
            color: 'var(--text-primary)'
          }">
          <span>{{ h.input }} → {{ h.output }}</span>
          <span>{{ h.correct ? '✓' : '✗' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMorseStore } from '../store/morse'
import { MORSE_TABLE } from '../utils/morse-code'

const store = useMorseStore()
</script>
