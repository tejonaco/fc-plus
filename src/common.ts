export function pasteLink(e: ClipboardEvent, iframe: HTMLIFrameElement) {
  const text = e.clipboardData?.getData("text");
  if (!text) return;

  const patterns = {
    youtube: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    ig: /(?:instagram\.com\/(?:p|reel)\/)([\w-]+)/,
    tweet: /(?:x\.com\/\w+\/status\/)(\d+)/,
    tiktok: /(?:tiktok\.com\/@[\w.]+\/video\/)(\d+)/
  };

  for (const [platform, regex] of Object.entries(patterns)) {
    const match = text.match(regex);
    if (match && match[1]) {
      insertPlatformEmbed(e, iframe, platform.toUpperCase(), match[1])
      e.preventDefault()
      e.stopPropagation()
      return
    }
  }
}

function insertPlatformEmbed(e: ClipboardEvent, iframe: HTMLIFrameElement, platform: string, id: string) {
  const textField = e.target as HTMLElement;
  if (!textField) return;

  const target = textField.querySelector('div:last-child') as HTMLElement ?? textField;

  removeTrailingLineBreaks(target);

  target.innerHTML += `[${platform}]${id}[/${platform}]<br>`;
  moveCursorToEnd(iframe, target);

  e.preventDefault();
}

function removeTrailingLineBreaks(element: HTMLElement) {
  while (element.lastChild && (element.lastChild as HTMLElement).tagName === 'BR') {
    element.lastChild.remove()
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