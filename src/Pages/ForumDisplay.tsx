import { useEffect, useState } from "preact/hooks"




export default function ForumDisplay() {
  const [ignoredWords, ] = useState<string[]>(GM_getValue('ignoredWords', []))
  const [ignoredUsers, ] = useState<string[]>(GM_getValue('ignoredUsers', []))

  const hasIgnoredWord = (text: string) => {
    const textWords = text.toLowerCase().split(' ')
    for (const word of ignoredWords) {
      if (word !== '' && textWords.includes(word)) {
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
        console.log('Hidden thread: ', title, user)
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