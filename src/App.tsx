import { useCallback, useEffect, useState } from "preact/hooks"
import { useApi } from "./api"


export default function App({ profileButton }: { profileButton: HTMLButtonElement }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [ignoredWords, setIgnoredWords] = useState<string[]>(GM_getValue('ignoredWords', []))
    const [ignoredUsers, setIgnoredUsers] = useState<string[]>(GM_getValue('ignoredUsers', []))
    const { getIgnoredUsers } = useApi()

    useEffect(()=> console.clear(), [])


    const handleProfileButtonClick = useCallback((e: MouseEvent) => {

        if (!showMenu && e.ctrlKey) {
            e.preventDefault()
            e.stopPropagation()
            setShowMenu(true)
        } else if (showMenu) {
            e.preventDefault()
            e.stopPropagation()
            setShowMenu(false)
        }
    }, [showMenu])

    useEffect(() => {
        profileButton.addEventListener('click',
            handleProfileButtonClick,
            { capture: true }) // event is captured before other listerners

        return () => profileButton.removeEventListener('click', handleProfileButtonClick, { capture: true })
    }, [showMenu])

    const hasIgnoredWord = (text: string) => {
        for (const word of ignoredWords) {
            if (word !== '' && text.toLowerCase().includes(' ' + word.toLowerCase() + ' ')) {
                return true
            }
        }
    }

    useEffect(() => {
        // console.clear()
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
        <div className='text-sm text-neutral-500'>
            {
                (showMenu || showModal) &&
                <>
                    <div className={`fixed z-10 top-0 left-0 w-full h-full`} onClick={() => {
                        setShowMenu(false)
                        setShowModal(false)
                    }} />

                    <div className={`fixed z-20 top-[60px] right-[10px] bg-white min-w-32 min-h-32
                            rounded-md overflow-y-auto flex ${showMenu ? 'flex' : 'hidden'}
                            flex-col p-2 shadow-lg shadow-neutral-400`}

                    >

                        <div className='border-b-2 border-neutral-300 cursor-pointer'
                            onClick={() => {
                                setShowModal(true)
                                setShowMenu(false)
                            }}
                        >
                            IGNORED WORDS
                        </div>
                        <div className='border-b-2 border-neutral-300 cursor-pointer'
                            onClick={() => {
                                getIgnoredUsers((users) => {
                                    setIgnoredUsers(users)
                                    GM_setValue('ignoredUsers', users)
                                    alert(`Ignored users loaded`)
                                    setShowMenu(false)
                                })
                            }}
                        >
                            RELOAD IGNORED USERS
                        </div>
                    </div>

                    <div className={`w-60 h-60 fixed z-20 top-[80px] left-1/2 -translate-x-1/2
                    bg-white shadow-md shadow-neutral-400 rounded-md p-2 ${showModal ? 'flex' : 'hidden'} flex-col items-center gap-2`}
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.stopImmediatePropagation()
                        }}>

                        <div className='flex w-full justify-between'>
                            <h1>Ignored list</h1>
                            <button className='text-red-700' onClick={() => setShowModal(false)}>
                                X
                            </button>
                        </div>
                        <textarea className='w-full h-full border-2 border-neutral-200 resize-none p-1'
                            onChange={({ target }) => {
                                const newWords = (target as HTMLTextAreaElement).value.split('\n')
                                setIgnoredWords(newWords)
                                GM_setValue('ignoredWords', newWords)
                            }}
                        >
                            {ignoredWords.join('\n')}
                        </textarea>
                    </div>
                </>
            }
        </div>
    )
}