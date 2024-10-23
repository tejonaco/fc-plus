import { useEffect } from 'preact/hooks'
import { log } from '../utils'
import unidecode from 'unidecode'
import { useSettings } from '../Settings'
import { tagTitles } from '../tagger/tagger'

export default function ForumDisplay({ ignoredWords, ignoredUsers }: { ignoredWords: string[]; ignoredUsers: string[] }) {
  const [settings] = useSettings()

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

    const titles: string[] = []

    for (const thread of threads) {
      const threadInfo = thread.querySelector('div > div:has(span > a)')
      if (!threadInfo) return

      const title = threadInfo.querySelector('span > a')?.textContent?.trim() ?? ''

      titles.push(title)

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

    tagTitles(titles).then((tags) => {
      for (const [i, tag] of tags.entries()) {
        const titleSpan = threads[i].querySelector<HTMLSpanElement>('span > a > span')
        if (!titleSpan) continue

        switch (tag) {
          case 'politica':
            titleSpan.style.color = '#6b21a8'
            break
          case 'futbol':
            titleSpan.style.color = '#009e60'
            break
        }
      }
    })
  }, [ignoredWords, ignoredUsers])

  return <></>
}
