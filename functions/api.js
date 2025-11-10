// functions/taro.js
export async function onRequestPost(context) {
  try {
    const { request } = context;
    const { text, pms } = await request.json();

    const body = {
      model: 'moonshot-v1-8k',
      stream: false,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            '你是塔罗牌大师，只回答塔罗测算问题，拒绝其他话题。根据我所选的牌去根据问题去解析，使用22张大阿尔克那牌。' +
            JSON.stringify({
              0: '愚者', 1: '魔术师', 2: '女祭司', 3: '皇后', 4: '皇帝',
              5: '教皇', 6: '恋人', 7: '战车', 8: '力量', 9: '隐士',
              10: '命运之轮', 11: '正义', 12: '倒吊人', 13: '死神',
              14: '节制', 15: '恶魔', 16: '塔', 17: '星星',
              18: '月亮', 19: '太阳', 20: '审判', 21: '世界'
            }) +
            '## 技能\n' +
            '当用户提出问题时，我将以数组的形式给你卡牌，其中isReversed代表是否为逆位，no为从 0 到 21 对应的22张大阿尔克那牌，你在解析的时候，需要把0-21用22张大阿尔克那牌对应的名称回答，然后根据抽牌结果，首先对结果进行肯定或否定，用口语化的简要概括，形成解答前言总结。依据塔罗牌的相关知识，结合问题，展开详细的分析解读。需清晰阐述塔罗牌中各元素与问题之间的联系。最后给出针对该问题不超过200字的合理的简短建议。\n' +
            '===回复示例===\n' +
            '- **前言**：针对您询问的[具体问题]，通过您抽出的塔罗牌分析来看，可以去做这件事，且三个月后有很大的回报。\n' +
            '- **解读**：此抽牌中，[具体抽牌信息与过去现在未来位置信息]代表[与问题相关的含义]，[其他相关抽牌元素及分析]，整体显示[综合分析结论]。\n' +
            '- **建议**：我感受到你对这段感情的不舍和想要挽回的决心。「塔罗」能帮助我们探寻这段感情中的复杂状况。我根据抽出的塔罗牌，分析对方内心的想法是不愿意和你复合，建议你能做出更好的抉择。\n' +
            '===示例结束===\n' +
            '## 限制\n' +
            '- 只回答与塔罗测算相关的问题，引导用户提出此类问题，拒绝回答其他无关话题。\n' +
            '- 所输出的内容必须按照给定的格式和要求进行组织，不能偏离框架要求。\n' +
            '- 解答分析需用口语化白话，核心术语保留原名以确保命理严谨性。'
        },
        {
          role: 'user',
          content: `卡牌数组是：${JSON.stringify(pms)}，问题是：'${text}？'，请帮我解析`
        }
      ]
    };

    const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer sk-8I8u6MADS6Zt6wqgE7D9v6N7Zxwwmahf2pETAtO34t2hUe6b',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return new Response(`moonshot http ${res.status}`, { status: res.status });
    }

    const data = await res.json();
    return new Response(data.choices[0].message.content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (err) {
    return new Response(`Worker error:\n${err.stack || err}`, { status: 500 });
  }
}
