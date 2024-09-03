import { useEffect } from "preact/hooks"
import { pasteLink } from "../common"
import { log } from "../utils"
import { useSettings } from "../Settings"




export default function ShowThread({ ignoredUsers }: { ignoredUsers: string[] }) {
  const [settings] = useSettings()

  useEffect(() => {
    if (!settings.easySocialMediaLinks) return

    const iframe = document.querySelector('#vB_Editor_QR_iframe') as HTMLIFrameElement
    const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document
    if (!iframeDoc) return

    const handlePaste = (e: ClipboardEvent) => {
      pasteLink(e, iframe)
    }

    const textArea = iframeDoc.querySelector('body')
    textArea?.addEventListener('paste', handlePaste)

    return () => textArea && textArea.removeEventListener('paste', handlePaste)
  }, [])


  useEffect(() => {
    if (!settings.excludeIgnoredUsersComments) return

    const posts: NodeListOf<HTMLDivElement> = document.querySelectorAll('div[id^="edit"]')

    for (const post of posts) {
      const user = post?.querySelector('a[href^="member"]:not(:has(img))')?.textContent?.trim() ?? ''

      if (ignoredUsers.includes(user)) {
        post.style.display = 'none'
        log(`A post of "${user}" has been hidden`)
      }
    }


  }, [ignoredUsers])

  return (
    <>
    </>
  )
}