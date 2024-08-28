import { useCallback, useEffect, useState } from "preact/hooks"
import { useApi } from "./api"
import Router, { Route } from "preact-router"
import ForumDisplay from "./Pages/ForumDisplay"
import ShowThread from "./Pages/ShowThread"


export default function App({ profileButton }: { profileButton: HTMLButtonElement }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [ignoredWords, setIgnoredWords] = useState<string[]>(GM_getValue('ignoredWords', []))
    const [ignoredUsers, setIgnoredUsers] = useState<string[]>(GM_getValue('ignoredUsers', []))
    const { getIgnoredUsers } = useApi()

    // useEffect(()=> console.clear(), [])


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


    return (
        <div className='text-sm text-neutral-600'>
            {
                (showMenu || showModal) &&
                <>
                    <div className={`fixed z-10 top-0 left-0 w-full h-full`} onClick={() => {
                        setShowMenu(false)
                        setShowModal(false)
                    }} />

                    <div className={`fixed z-20 top-[60px] right-[10px] bg-white min-w-32 min-h-32
                            rounded-md overflow-y-auto ${showMenu ? 'flex' : 'hidden'}
                            flex-col p-2 shadow-md border-[1px] border-neutral-300 shadow-neutral-400`}

                    >

                        <div className='border-b-2 border-neutral-200 py-1 cursor-pointer hover:text-orange-600'
                            onClick={() => {
                                setShowModal(true)
                                setShowMenu(false)
                            }}
                        >
                            IGNORED WORDS
                        </div>
                        <div className='border-b-2 border-neutral-200 py-1 cursor-pointer hover:text-orange-600'
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

            <div>
                <Router>
                    <Route path='/foro/forumdisplay.php/:forum?' component={ForumDisplay}/>
                    <Route path='/foro/showthread.php/:thread?' component={() => <ShowThread ignoredUsers={ignoredUsers}/>}/>
                </Router>
            </div>
        </div>
    )
}