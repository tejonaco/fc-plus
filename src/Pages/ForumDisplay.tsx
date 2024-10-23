import { useEffect, useMemo } from 'preact/hooks'
import { log } from '../utils'
import unidecode from 'unidecode'
import { useSettings } from '../Settings'
import { useTagger } from '../tagger/tagger'
import { Tag } from '../..'

export default function ForumDisplay({ ignoredWords, ignoredUsers, tags }: { ignoredWords: string[]; ignoredUsers: string[]; tags: Tag[] }) {
  const [settings] = useSettings()
  const tagTitles = useTagger()

  const tagColors = useMemo(() => {
    let res: { [tag: string]: string } = {}
    for (const tag of tags) {
      res[tag.name] = tag.color
    }
    return res
  }, [tags])

  const hasIgnoredWord = (text: string) => {
    text = unidecode(text.toLowerCase())

    for (let word of ignoredWords) {
      word = unidecode(word.toLowerCase())
      const regex = new RegExp(`\\b${word}\\b`)

      if (word !== '' && text.match(regex)) {
        return true
      }
    }
    return false
  }

  function hide(thread: HTMLDivElement) {
    thread.style.display = 'none'
    const separator = thread.nextElementSibling
    if (separator instanceof HTMLElement && separator.tagName == 'SEPARATOR') {
      separator.style.display = 'none'
    }
  }

  useEffect(() => {
    const threads: NodeListOf<HTMLDivElement> = document.querySelectorAll('section > div:has(div > div > span > a)')

    for (const thread of threads) {
      const threadInfo = thread.querySelector('div > div:has(span > a)')
      if (!threadInfo) return

      const title = threadInfo.querySelector('span > a')?.textContent?.trim() ?? ''

      const footerString = threadInfo.querySelector('div > a > span')?.textContent?.trim()
      const user = footerString?.split(' - ')[0].slice(1) ?? ''

      if (hasIgnoredWord(title) && settings.excludeIgnoredWords) {
        hide(thread)
        log(`Ocultado el hilo "${title}"`)
      }

      if (ignoredUsers.includes(user) && settings.excludeIgnoredUsersThreads) {
        hide(thread)
        log(`Ocultado el hilo "${title}" del usuario "@${user}"`)
      }
    }
  }, [ignoredWords, ignoredUsers])

  useEffect(() => {
    if (!settings.tags.enable) return

    const threads: NodeListOf<HTMLDivElement> = document.querySelectorAll('section > div:has(div > div > span > a)')
    const titles = Array.from(threads).map((thread) => thread.querySelector('div > div > span > a')?.textContent?.trim() ?? '')

    tagTitles(titles, tags).then((titlesTags) => {
      for (const [i, tag] of titlesTags.entries()) {
        const titleSpan = threads[i].querySelector<HTMLSpanElement>('span > a > span')
        if (!titleSpan) continue

        if (tag in tagColors) {
          titleSpan.style.color = tagColors[tag]
        }
      }
    })
  }, [tags])

  return <></>
}
