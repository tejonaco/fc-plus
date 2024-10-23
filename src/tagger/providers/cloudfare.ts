import { log } from '../../utils'

const token = import.meta.env.VITE_CLOUDFARE_TOKEN
const id = import.meta.env.VITE_CLOUDFARE_ID
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/@cf/`

const model = 'meta/llama-3.1-70b-instruct'

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
    }

    GM_xmlhttpRequest({
      method: 'POST',
      url: endpoint + model,
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      onload: function (response) {
        const resp = JSON.parse(response.response as string)

        const content: string = resp.result.response
        log(content)
        resolve(content)
      },
      onerror: function (error) {
        reject(error)
      },
    })
  })
}
