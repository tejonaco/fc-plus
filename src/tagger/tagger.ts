import { ask } from './providers/glhf'

const tags = { politica: 'critica o debate sobre cualquier partido político o medida tomada por estos', futbol: 'noticias o discursion sobre fútbol o peñas futbolísticas' }

export async function tagTitles(titles: string[]) {
  const prompt = `
    Eres un clasificador de titulos de posts en un foro, no juzgas, solo clasificas.
    Debes clasificar cada titulo con una de las siguientes categorías, acompañadas de su explicación:
    ${Object.entries(tags)
      .map((e) => `"${e[0]}": ${e[1]}`)
      .join('\n')}.
    "otros": el titulo no encaja con ninguna de las categorias anteriores
    
    TU RESPUESTA ESPERA UNICAMENTE UN ARRAY DE STRINGS QUE CONTENGA UNICAMENTE LAS CATEGORIAS QUE SERÁ INTRODUCIDO DIRECTAMENTE EN JSON.parse()
    `

  const response = await ask(prompt, titles)
  return JSON.parse(response)
}
