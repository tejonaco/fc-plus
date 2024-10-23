import { ApiCreds } from '../../..'
import { log } from '../../utils'

const model = 'meta/llama-3.1-70b-instruct'

export function ask(prompt: string, titles: string[], creds: ApiCreds) {
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
      url: `https://api.cloudflare.com/client/v4/accounts/${creds.id}/ai/run/@cf/${model}`,
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + creds.token,
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
