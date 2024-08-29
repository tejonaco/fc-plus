import { useEffect } from "preact/hooks";


export default function Profile({ do_, loadIgnoredUsers }: { do_: string, loadIgnoredUsers: (showAlert?: boolean) => void }) {

  useEffect(() => {
    if (['ignorelist', 'doaddlist', 'doremovelist'].includes(do_)) {
      // on ignorelist page, or adding/remove someone to a list (probably ignore list)
      loadIgnoredUsers(false)
    }
  }, [])

  return (
    <></>
  )
}