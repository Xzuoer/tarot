<!-- TarotHome.vue -->
<template>
  <section class="Home">
    <!-- 顶部区域：图片+标题 居中 -->
    <div class="head-center">
      <!-- 图片大小就在路径旁调 -->
      <img src="@/assets/images/ip.gif" width="40%" alt="tarot-icon" class="tarot-icon" />
      <h3>深呼吸，屏除杂念，开始你的塔罗解惑之旅</h3>
    </div>

    <!-- 以下结构与原先完全一致 -->
    <div class="text">
      <Textarea
        v-model.trim="textValue"
        placeholder="STEP1：戳我输入你的问题（必须）..."
        :disabled="loadingStatus"
      />
    </div>

    <template v-if="!loadingStatus">
      <!-- STEP2 文案居左 -->
      <h3 class="text nb step2-left">STEP2：请选择3张塔罗牌（必须）</h3>
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
          <p ref="typedText" />
        </AlertDescription>
      </Alert>
      <Button class="mt-4 ml-auto block w-max" @click="resetFn">
        继续提问
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
/* ========== 以下脚本与原文件完全一致 ========== */
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

/* ② 仅追加本次需求内容（无背景，只留居中+居左） */
.head-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.tarot-icon {
  user-select: none;
}

/* STEP2 文案恢复居左 */
.step2-left {
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  padding-left: 20px;
  box-sizing: border-box;
}
</style>
