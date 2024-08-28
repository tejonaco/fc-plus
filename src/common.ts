export function pasteLink(e: ClipboardEvent, iframe: HTMLIFrameElement) {
  const text = e.clipboardData?.getData("text");
  if (text && text.includes('youtube.com')) {
    const regex = /^.*(youtu\.be\/|v\/|u\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = text.match(regex);
    if (match && match[2]) {
      const id = match[2];
      const textField = e.target as HTMLBodyElement;
      if (textField) {

        const lastDiv = textField.querySelectorAll('div')[-1]

        const target = lastDiv ?? textField
        var lastChild = target.lastChild as HTMLElement

        
        if (lastChild.tagName == 'BR') {
          lastChild.remove()
          // sometimes are two br
          lastChild = target.lastChild as HTMLElement
          if (lastChild && lastChild.tagName == 'BR') {
            lastChild.remove()
          }
        }

        target.innerHTML += '[YOUTUBE]' + id + '[/YOUTUBE]'
        moveCursorToEnd(iframe, target)

        // discard original link paste
        e.preventDefault()
      }
    }
  }
}


export function moveCursorToEnd(iframe: HTMLIFrameElement, element?: HTMLElement) {
  const doc = iframe.contentDocument || iframe.contentWindow?.document
  const wind = iframe.contentWindow
  if (!doc || !wind) return

  if (!element) {
    element = doc.body
  }

  const range = doc.createRange();

  range.selectNodeContents(element);
  range.collapse(false);

  const selection = wind.getSelection();
  if (!selection) return

  selection.removeAllRanges();
  selection.addRange(range);

}