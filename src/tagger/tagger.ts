import { useCallback } from 'preact/hooks'
import { ApiCreds, Tag } from '../..'
import { useSettings } from '../Settings'
import { ask as askGlhf } from './providers/glhf'
import { ask as askGithub } from './providers/github'
import { ask as askCloudfare } from './providers/cloudflare'

export function useTagger() {
  const [settings] = useSettings()

  const ask = useCallback(
    async function (prompt: string, titles: string[]) {
      switch (settings.tags.provider) {
        case 'glhf':
          return await askGlhf(prompt, titles, settings.tags.providers.glhf.token)
        case 'github':
          return await askGithub(prompt, titles, settings.tags.providers.github.token)
        case 'cloudflare':
          return await askCloudfare(prompt, titles, settings.tags.providers.cloudflare)
      }
    },
    [settings.tags.provider],
  )

  async function tagTitles(titles: string[], tags: Tag[]) {
    const prompt = `Eres un clasificador de titulos de posts en un foro, no juzgas, solo clasificas.
  Debes clasificar cada titulo con una de las siguientes categorías, acompañadas de su explicación:
  ${tags.map(({ name, description }) => `"${name}": ${description}`).join('\n')}.
  "otros": el titulo no encaja con ninguna de las categorias anteriores
  
  TU RESPUESTA ESPERA UNICAMENTE UN ARRAY DE STRINGS QUE CONTENGA UNICAMENTE LAS CATEGORIAS QUE SERÁ INTRODUCIDO DIRECTAMENTE EN JSON.parse()`

    const response = await ask(prompt, titles)
    return JSON.parse(response)
  }

  return tagTitles
}

export const DEFAULT_CATEGORIES: Tag[] = [
  { name: 'política', description: 'critica o debate sobre cualquier partido político, nombres propios de políticos conocidos, polémicas, o medidas tomadas por estos', color: '#6b21a8' },
  { name: 'fútbol', description: 'noticias o discursion sobre fútbol, jugadores de fútbol o peñas futbolísticas', color: '#009e60' },
  { name: 'porno', description: 'titulos que sugieren sexo, siempre deben de contener la palabra "+18"', color: '#dc2626' },
]
