<!-- TarotHome.vue -->
<template>
  <section class="Home">
    <!-- 星空闪烁层 -->
    <div class="starfield" />

    <div class="text">
      <!-- 新增图标 -->
      <img src="@/assets/images/ip.gif" class="tarot-icon" alt="tarot-icon" />

      <h3>深呼吸，屏除杂念，开始你的塔罗解惑之旅</h3>
      <Textarea
        v-model.trim="textValue"
        placeholder="STEP1：戳我输入你的问题（必须）..."
        :disabled="loadingStatus"
      />
    </div>

    <!-- 以下与原文件完全一致 -->
    <template v-if="!loadingStatus">
      <h3 class="text nb">STEP2：请选择3张塔罗牌（必须）</h3>
      <div class="card-list" :class="{ active: selectCardArr.length }">
        <div
          class="card"
          :class="{ active: selectCardArr.includes(i) }"
          v-for="i in randomCard"
          :key="i"
          @click="selectCard(i)"
        />
      </div>
      <div class="btn">
        <Button
          class="mt-4 w-full"
          :disabled="selectCardArr.length < 3 || !textValue"
          @click="getRes"
        >
          开始占卜
        </Button>
      </div>
    </template>

    <div class="card-jx" v-else>
      <div class="show-card">
        <img
          :class="{ rever: i.isReversed }"
          :src="renderIMG(`${i.no}.jpg`)"
          v-for="i in selectCardArr"
          :key="i"
        />
      </div>
      <Alert class="mt-4" v-if="resStatus">
        <AlertTitle>抽牌结果解析：</AlertTitle>
        <AlertDescription>
          <p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText" />
        </AlertDescription>
      </Alert>
      <Button class="mt-4 ml-auto block w-max" @click="resetFn">
        继续提问
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
/* ========== 以下脚本与原文件完全一致，未动 ========== */
import { ref } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const randomCard = ref<number[]>(
  Array.from({ length: 22 }, (_, i) => i).sort(() => Math.random() - 0.5)
)

const selectCardArr = ref<any[]>([])
const selectCard = (id: number) => {
  if (selectCardArr.value.includes(id)) {
    selectCardArr.value = selectCardArr.value.filter((i) => i !== id)
    return
  }
  if (selectCardArr.value.length > 2) return
  selectCardArr.value.push(id)
}

const textValue = ref('')
const loadingStatus = ref(false)
const resStatus = ref(false)

const getRes = async () => {
  loadingStatus.value = true
  selectCardArr.value = selectCardArr.value.map((i) => ({
    no: i,
    isReversed: Math.random() > 0.5,
  }))
  vh.showLoading()
  const res = await fetch('/api', {
    method: 'POST',
    body: JSON.stringify({ text: textValue.value, pms: selectCardArr.value }),
  })
  vh.hideLoading()
  resStatus.value = true
  const resText = await res.text()
  renderRES(resText)
}

const typedText = ref<HTMLParagraphElement>()
const renderRES = async (md: string) => {
  const renderedMarkdown = await marked.parse(md)
  new Typed(typedText.value!, {
    strings: [renderedMarkdown],
    typeSpeed: 16,
    showCursor: false,
  })
}

const resetFn = async () => {
  vh.showLoading()
  await new Promise((resolve) => setTimeout(resolve, 666))
  selectCardArr.value = []
  textValue.value = ''
  resStatus.value = false
  loadingStatus.value = false
  randomCard.value = Array.from({ length: 22 }, (_, i) => i).sort(
    () => Math.random() - 0.5
  )
  vh.hideLoading()
}

const renderIMG = (url: string) =>
  new URL(`../../assets/images/card/${url}`, import.meta.url).href
</script>

<style scoped lang="less">
/* ① 原 Home.less 保持不动 */
@import 'Home.less';

/* ② 仅追加本次需求内容 */
:root {
  --icon-size: 40px; /* 图标大小可调 */
}

.Home {
  position: relative; /* 让伪元素绝对定位参照 */
}

/* 星空闪烁 */
.starfield {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.starfield::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: transparent
    radial-gradient(2px 2px at 20px 30px, #fff, transparent)
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent)
    radial-gradient(1px 1px at 90px 40px, #fff, transparent)
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.6), transparent)
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
  background-size: 200px 100px;
  animation: sparkle 4s linear infinite;
}
@keyframes sparkle {
  0% { opacity: 0.35; }
  50% { opacity: 1; }
  100% { opacity: 0.35; }
}

/* 图标居中 & 大小 */
.text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tarot-icon {
  width: var(--icon-size);
  height: auto;
  margin-bottom: 16px;
  user-select: none;
}
</style>
