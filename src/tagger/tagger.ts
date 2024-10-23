import { Tag } from '../..'
import { ask } from './providers/glhf'

export async function tagTitles(titles: string[], tags: Tag[]) {
  const prompt = `Eres un clasificador de titulos de posts en un foro, no juzgas, solo clasificas.
Debes clasificar cada titulo con una de las siguientes categorías, acompañadas de su explicación:
${tags.map(({ name, description }) => `"${name}": ${description}`).join('\n')}.
"otros": el titulo no encaja con ninguna de las categorias anteriores

TU RESPUESTA ESPERA UNICAMENTE UN ARRAY DE STRINGS QUE CONTENGA UNICAMENTE LAS CATEGORIAS QUE SERÁ INTRODUCIDO DIRECTAMENTE EN JSON.parse()`

  const response = await ask(prompt, titles)
  return JSON.parse(response)
}

export const DEFAULT_CATEGORIES: Tag[] = [
  { name: 'política', description: 'critica o debate sobre cualquier partido político, nombres propios de políticos conocidos, polémicas, o medidas tomadas por estos', color: '#6b21a8' },
  { name: 'fútbol', description: 'noticias o discursion sobre fútbol, jugadores de fútbol o peñas futbolísticas', color: '#009e60' },
  { name: 'porno', description: 'titulos que sugieren sexo, siempre deben de contener la palabra "+18"', color: '#dc2626' },
]
