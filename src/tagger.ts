const token = import.meta.env.VITE_GITHUB_TOKEN
const endpoint = 'https://models.inference.ai.azure.com'
const modelName = 'gpt-4o'
const tags = { politica: 'critica o debate sobre cualquier partido político o medida tomada por estos' }

export async function tagTitles(titles: string[]) {
  return new Promise<string[]>((resolve, reject) => {
    const body = {
      messages: [
        {
          role: 'system',
          content: `
          Debes clasificar cada titulo con una de las siguientes categorías, acompañadas de su explicación:
          ${Object.entries(tags)
            .map((e) => `"${e[0]}": ${e[1]}`)
            .join('\n')}.
          "otros": el titulo no encaja con ninguna de las categorias anteriores

          Responde con una lista de categorías, escritas de forma exacta separadas por comas [..., ...].
          `,
        },
        { role: 'user', content: JSON.stringify(titles) },
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
        const content: string = resp.choices[0].message.content
        console.log(resp)
        resolve(JSON.parse(content))
      },
      onerror: function (error) {
        reject(error)
      },
    })
  })
}
