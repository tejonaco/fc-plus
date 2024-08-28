import { useEffect, useState } from "preact/hooks"




export default function ShowThread({ignoredUsers}: {ignoredUsers: string[]}) {

  useEffect(() => {
    console.log(ignoredUsers)
    const posts: NodeListOf<HTMLDivElement> = document.querySelectorAll('div[id^="edit"]')

    for (const post of posts) {
      const user = post?.querySelector('a[href^="member"]:not(:has(img))')?.textContent?.trim() ?? ''

      if(ignoredUsers.includes(user)) {
          post.style.display = 'none'
          console.log(`A post of "${user}" has been hidden`)
      }
    }


  }, [ignoredUsers])

  return (
    <>
    </>
  )
}