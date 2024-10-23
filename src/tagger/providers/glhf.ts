// https://glhf.chat/users/settings/api

import { log } from '../../utils'

const endpoint = `https://glhf.chat/api/openai/v1/chat/completions`

const model = 'hf:Qwen/Qwen2.5-72B-Instruct'

export function ask(prompt: string, titles: string[], token: string) {
  return new Promise<string>((resolve, reject) => {
    const body = {
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        { role: 'user', content: titles.join('\n') },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model,
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: endpoint,
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      onload: function (response) {
        const resp = JSON.parse(response.response as string)

        if (!resp.choices) {
          return reject(['Error in response', resp])
        }

        const content: string = resp.choices[0].message.content
        log(content)
        resolve(content)
      },
      onerror: function (error) {
        reject(error)
      },
    })
  })
}
