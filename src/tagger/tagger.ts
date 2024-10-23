import { ask } from './providers/githubModels'

const tags = { politica: 'critica o debate sobre cualquier partido político o medida tomada por estos', futbol: 'noticias o discursion sobre fútbol o peñas futbolísticas' }

export async function tagTitles(titles: string[]) {
  const prompt = `
    Eres un clasificador de titulos de posts en un foro, no juzgas, solo clasificas.
    Debes clasificar cada titulo con una de las siguientes categorías, acompañadas de su explicación:
    ${Object.entries(tags)
      .map((e) => `"${e[0]}": ${e[1]}`)
      .join('\n')}.
    "otros": el titulo no encaja con ninguna de las categorias anteriores
    
    Eres parte de un programa informático, por lo que tu respuesta debe de ser predecible y tener este formato:
    ["tag1", "tag3", "otros", ...]
    `

  const response = await ask(prompt, titles)
  return JSON.parse(response)
}
