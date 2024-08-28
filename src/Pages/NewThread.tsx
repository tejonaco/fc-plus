import { useEffect } from "preact/hooks"
import { pasteLink } from "../common"
import { log } from "../utils"




export default function NewThread() {

  useEffect(() => {
    const iframe = document.querySelector('#vB_Editor_001_iframe') as HTMLIFrameElement
    const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document
    if (!iframeDoc) return

    const handlePaste = (e: ClipboardEvent) => {
      pasteLink(e, iframe)
    }

    const textArea = iframeDoc.querySelector('body')
    textArea?.addEventListener('paste', handlePaste)

    return () => textArea && textArea.removeEventListener('paste', handlePaste)
  }, [])


  return (
    <>
    </>
  )
}