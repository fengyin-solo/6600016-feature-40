<template>
  <div class="min-h-screen p-4 flex flex-col gap-4 max-w-6xl mx-auto" :data-theme="store.theme">
    <h1 class="text-3xl font-bold" :style="{ color: 'var(--accent)' }">莫尔斯码实时训练与通讯器</h1>

    <!-- Tabs -->
    <div class="flex gap-2">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-4 py-2 rounded text-sm font-medium transition-colors"
        :style="activeTab === tab.id
          ? { background: 'var(--accent)', color: 'var(--accent-text)' }
          : { background: 'var(--tab-inactive-bg)', color: 'var(--tab-inactive-text)' }">
        {{ tab.label }}
      </button>
    </div>

    <!-- Encode/Decode Mode -->
    <div v-if="activeTab === 'translate'" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl p-4" :style="{ background: 'var(--bg-panel)' }">
          <h3 class="font-bold mb-2" :style="{ color: 'var(--accent-subtle)' }">文本输入</h3>
          <textarea v-model="store.inputText" class="w-full h-32 rounded p-3 resize-none"
            :style="{ background: 'var(--bg-input)', color: 'var(--text-primary)' }"
            placeholder="输入英文文本..." @input="store.encode()" />
          <button @click="store.playMorse(store.morseOutput)" :disabled="store.isPlaying"
            class="mt-2 px-4 py-2 rounded transition-colors disabled:opacity-50"
            :style="{ background: 'var(--accent)', color: 'var(--accent-text)' }">
            {{ store.isPlaying ? '播放中...' : '▶ 播放音频' }}
          </button>
        </div>
        <div class="rounded-xl p-4" :style="{ background: 'var(--bg-panel)' }">
          <h3 class="font-bold mb-2" :style="{ color: 'var(--accent-subtle)' }">莫尔斯码输出</h3>
          <div class="w-full h-32 rounded p-3 overflow-y-auto font-mono text-lg"
            :style="{ background: 'var(--bg-input)', color: 'var(--morse-text)' }">
            {{ store.morseOutput || '编码结果...' }}
          </div>
          <button @click="store.decode()" class="mt-2 px-4 py-2 rounded transition-colors"
            :style="{ background: 'var(--action-bg)', color: '#fff' }">
            反向解码
          </button>
          <p class="mt-1 text-sm" :style="{ color: 'var(--text-muted)' }">解码: {{ store.decodedText }}</p>
        </div>
      </div>
      <WaveformDisplay />
    </div>

    <!-- Training Mode -->
    <div v-if="activeTab === 'train'" class="flex flex-col gap-4">
      <TrainingMode />
    </div>

    <!-- Reference Table -->
    <div v-if="activeTab === 'ref'" class="rounded-xl p-4" :style="{ background: 'var(--bg-panel)' }">
      <h3 class="font-bold mb-3" :style="{ color: 'var(--accent-subtle)' }">莫尔斯码速查表</h3>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
        <div v-for="(code, char) in morseTable" :key="char"
          class="rounded p-2 text-center" :style="{ background: 'var(--bg-card)' }">
          <div class="text-xl font-bold" :style="{ color: 'var(--accent)' }">{{ char }}</div>
          <div class="font-mono text-sm" :style="{ color: 'var(--morse-text)' }">{{ code }}</div>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="rounded-xl p-4 grid grid-cols-4 gap-4" :style="{ background: 'var(--bg-panel)' }">
      <div>
        <label class="text-sm" :style="{ color: 'var(--text-muted)' }">速度 (WPM): {{ store.wpm }}</label>
        <input type="range" v-model.number="store.wpm" min="5" max="40" class="w-full" />
      </div>
      <div>
        <label class="text-sm" :style="{ color: 'var(--text-muted)' }">频率 (Hz): {{ store.frequency }}</label>
        <input type="range" v-model.number="store.frequency" min="300" max="1200" class="w-full" />
      </div>
      <div>
        <label class="text-sm" :style="{ color: 'var(--text-muted)' }">音量: {{ store.volume.toFixed(1) }}</label>
        <input type="range" v-model.number="store.volume" min="0" max="1" step="0.1" class="w-full" />
      </div>
      <div>
        <label class="text-sm" :style="{ color: 'var(--text-muted)' }">主题</label>
        <div class="flex gap-2 mt-1">
          <button v-for="t in themes" :key="t.value" @click="store.theme = t.value"
            class="flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors"
            :style="store.theme === t.value
              ? { background: 'var(--accent)', color: 'var(--accent-text)' }
              : { background: 'var(--tab-inactive-bg)', color: 'var(--tab-inactive-text)', border: '1px solid var(--border-subtle)' }">
            {{ t.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMorseStore } from './store/morse'
import { MORSE_TABLE } from './utils/morse-code'
import WaveformDisplay from './components/WaveformDisplay.vue'
import TrainingMode from './components/TrainingMode.vue'

const store = useMorseStore()
const morseTable = MORSE_TABLE

const tabs = [
  { id: 'translate', label: '编码/解码' },
  { id: 'train', label: '训练模式' },
  { id: 'ref', label: '速查表' },
]
const activeTab = ref('translate')

const themes = [
  { value: 'dark' as const, label: '夜间' },
  { value: 'high-contrast' as const, label: '高对比' },
]
</script>
