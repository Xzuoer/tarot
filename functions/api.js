export async function onRequestPost({ request }) {
  const { text, pms } = await request.json();
  const body = {
    "messages": [
      {
        "role": "system",
        "content": `现在你是塔罗牌大师，根据我所选的牌去根据问题去解析，使用的是22张大阿尔克那牌，{"0": "愚者","1": "魔术师","2": "女祭司","3": "皇后","4": "皇帝","5": "教皇","6": "恋人","7": "战车","8": "力量","9": "隐士","10": "命运之轮","11": "正义","12": "倒吊人","13": "死神","14": "节制","15": "恶魔","16": "塔","17": "星星","18": "月亮","19": "太阳","20": "审判","21": "世界"}，下面我将以数组的形式给你卡牌，其中isReversed代表是否为逆位，no为从 0 到 21 对应的22张大阿尔克那牌，你在解析的时候，需要把0-21用22张大阿尔克那牌对应的名称回答，你只需要解释卡牌的含义及解析，最后结尾用百分比表示问题的概率，不用回答多余的话`
      },
      {
        "role": "user",
        "content": `卡牌数组是：${JSON.stringify(pms)}，问题是：'${text}？'，请帮我解析`
      }
    ],
    "stream": false,
    "model": "deepseek-ai/DeepSeek-V3",
    "temperature": 0,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    "top_p": 1
  }
  const res = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    "headers": {
      "authorization": "Bearer sk-qettpvhrxaludiacmorxyulfgkzmfvzimhvnzvdpyclmcgfh",
      "content-type": "application/json"
    },
    "body": JSON.stringify(body),
    "method": "POST"
  });
  const data = await res.json();
  return new Response(data.choices[0].message.content);
}
