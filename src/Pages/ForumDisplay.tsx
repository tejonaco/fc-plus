import { useEffect } from "preact/hooks"
import { log } from "../utils"
import unidecode from "unidecode"



export default function ForumDisplay({ignoredWords, ignoredUsers}: {ignoredWords: string[], ignoredUsers: string[]}) {

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

  useEffect(() => {
    const threads: NodeListOf<HTMLDivElement> = document.querySelectorAll('section > div:has(div > div > span > a)')
    for (const thread of threads) {
      const threadInfo = thread.querySelector('div > div:has(span > a)')
      if (!threadInfo) return

      const title = threadInfo.querySelector('span > a')?.textContent?.trim() ?? ''
      const footerString = threadInfo.querySelector('div > a > span')?.textContent?.trim()
      const user = footerString?.split(' - ')[0].slice(1) ?? ''

      if (hasIgnoredWord(title) || ignoredUsers.includes(user)) {
        thread.style.display = 'none'
        log('Hidden thread: ', title, user)
        const separator = thread.nextElementSibling
        if (separator instanceof HTMLElement && separator.tagName == 'SEPARATOR') {
          separator.style.display = 'none'
        }

      }
    }

  }, [ignoredWords, ignoredUsers])

  return (
    <>
    </>
  )
}