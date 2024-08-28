

export function useApi() {

  const getIgnoredUsers = (setIgnoredUsers: (users: string[]) => void) => {
    const handleLoaded = (r: VMScriptResponseObject<ReturnType<typeof GM_xmlhttpRequest>>) => {

      if (!r.responseText) return

      const parser = new DOMParser()
      const html = parser.parseFromString(r.responseText, 'text/html')
      const ignoredUsers = html.querySelectorAll('#ignorelist > li > a')

      setIgnoredUsers(Array.from(ignoredUsers).map(a => a.innerHTML.trim()))
    }
    GM_xmlhttpRequest({
      url: 'https://forocoches.com/foro/profile.php?do=ignorelist',
      onloadend: handleLoaded
    })
  }

  return {getIgnoredUsers}
}