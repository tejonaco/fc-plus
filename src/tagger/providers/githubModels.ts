import { log } from "../../utils"

const token = import.meta.env.VITE_GITHUB_TOKEN
const endpoint = 'https://models.inference.ai.azure.com'
const modelName = 'gpt-4o'

export function ask(prompt: string, titles: string[]) {
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
      model: modelName,
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: endpoint + '/chat/completions',
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
