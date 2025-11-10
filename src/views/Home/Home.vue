<template>
  <section class="Home">
    <div class="text">
      <h3>深呼吸，屏除杂念，开始你的塔罗解惑之旅</h3>
      <Textarea v-model.trim="textValue" placeholder="STEP1：戳我输入你的问题（必须）..." :disabled="loadingStatus" />
    </div>
    <template v-if="!loadingStatus">
      <h3 class="text nb">STEP2：请选择3张塔罗牌（必须）</h3>
      <div class="card-list" :class="{ active: selectCardArr.length }">
        <div class="card" :class="{ active: selectCardArr.includes(i) }" v-for="i in randomCard" :key="i" @click="selectCard(i)"></div>
      </div>
      <div class="btn">
        <Button class="mt-4 w-full" :disabled="selectCardArr.length < 3 || !textValue" @click="getRes">开始占卜</Button>
      </div>
    </template>
    <div class="card-jx" v-else>
      <div class="show-card">
        <img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)" v-for="i in selectCardArr" :key="i" />
      </div>
      <Alert class="mt-4" v-if="resStatus">
        <AlertTitle>抽牌结果解析：</AlertTitle>
        <AlertDescription><p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p></AlertDescription>
      </Alert>
      <Button class="mt-4 ml-auto block w-max" @click="resetFn">继续提问</Button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// 随机卡牌
const randomCard = ref<number[]>(Array.from({ length: 22 }, (_, i) => i))
// Fisher-Yates 洗牌算法
for (let i = randomCard.value.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]
}

// 选择卡牌
const selectCardArr = ref<Array<any>>([])
const selectCard = (id: number) => {
  if (selectCardArr.value.includes(id)) {
    selectCardArr.value = selectCardArr.value.filter((i) => i !== id)
    return
  }
  if (selectCardArr.value.length > 2) return
  selectCardArr.value.push(id)
}

// 获取解析
const textValue = ref<string>('')
const loadingStatus = ref<boolean>(false)
const resStatus = ref<boolean>(false)
const getRes = async () => {
  loadingStatus.value = true
  selectCardArr.value = selectCardArr.value.map((i) => ({ no: i, isReversed: Math.random() > 0.5 }))
  vh.showLoading()
  const res = await fetch('/api', { method: 'POST', body: JSON.stringify({ text: textValue.value, pms: selectCardArr.value }) })
  vh.hideLoading()
  resStatus.value = true
  const resText = await res.text()
  renderRES(resText)
}

// 渲染后的 HTML 内容
const typedText = ref<HTMLParagraphElement>()
const renderRES = async (md: string) => {
  const renderedMarkdown = await marked.parse(md)
  new Typed(typedText.value, { strings: [renderedMarkdown], typeSpeed: 16, showCursor: false })
}

// 重置
const resetFn = async () => {
  vh.showLoading()
  await new Promise((resolve) => setTimeout(resolve, 666))
  selectCardArr.value = []
  textValue.value = ''
  resStatus.value = false
  loadingStatus.value = false
  for (let i = randomCard.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]
  }
  vh.hideLoading()
}

// 动态渲染卡牌
const renderIMG = (url: string) => new URL(`../../assets/images/card/${url}`, import.meta.url).href
</script>

<style scoped lang="less">
@import 'Home.less';
</style>
