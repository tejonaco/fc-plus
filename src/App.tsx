import { useCallback, useEffect, useState } from "preact/hooks"
import { useApi } from "./api"
import Router, { Route } from "preact-router"
import ForumDisplay from "./Pages/ForumDisplay"
import ShowThread from "./Pages/ShowThread"
import NewReply from "./Pages/NewReply"
import NewThread from "./Pages/NewThread"
import * as icons from './Icons'
import { log } from "./utils"
import Profile from "./Pages/Profile"


export default function App({ profileButton }: { profileButton: HTMLButtonElement }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [ignoredWords, setIgnoredWords] = useState<string[]>(GM_getValue('ignoredWords', []))
    const [ignoredUsers, setIgnoredUsers] = useState<string[]>(GM_getValue('ignoredUsers', []))
    const { getIgnoredUsers } = useApi()


    // useEffect(()=> console.clear(), [])

    const loadIgnoredUsers = (raiseAlert = true) => {
        getIgnoredUsers((users) => {
            if (JSON.stringify(users) != JSON.stringify(ignoredUsers)) {
                setIgnoredUsers(users)
                GM_setValue('ignoredUsers', users)
            }
            raiseAlert && alert(`Ignored users loaded`)
            log('Ignored users: ' + users.join(', '))
            setShowMenu(false)
        })
    }


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
        <div className='text-md text-neutral-700'>
            {
                (showMenu || showModal) &&
                <>
                    <div className={`fixed z-10 top-0 left-0 w-full h-full bg-neutral-400 opacity-20`} onClick={() => {
                        setShowMenu(false)
                        setShowModal(false)
                    }} />

                    <div className={`fixed z-20 top-[60px] right-[10px] bg-white min-w-32 min-h-32
                            rounded-md overflow-y-auto ${showMenu ? 'flex' : 'hidden'}
                            flex-col p-2 shadow-md border-[1px] border-neutral-300 shadow-neutral-400`}

                    >

                        <div className='border-b-2 flex gap-1 items-center border-neutral-200 py-1 cursor-pointer hover:text-orange-600'
                            onClick={() => {
                                setShowModal(true)
                                setShowMenu(false)
                            }}
                        >
                            <span className='w-4'>{icons.pencil}</span>
                            Palabras ignoradas
                        </div>
                        <div className='border-b-2 flex gap-1 items-center border-neutral-200 py-1 cursor-pointer hover:text-orange-600'
                            onClick={() => loadIgnoredUsers()}
                        >
                            <span className='w-4'>{icons.user}</span>
                            Cargar usuarios ignorados
                        </div>
                    </div>

                    <div className={`fixed z-20 top-[80px] left-1/2 -translate-x-1/2
                    bg-white shadow-md shadow-neutral-400 rounded-md p-2 ${showModal ? 'flex' : 'hidden'} flex-col items-center gap-2`}>

                        <div className='flex w-full justify-between'>
                            <div className='flex flex-col'>
                                <h1 className='text-lg'>Palabras ignoradas</h1>
                                <p className='text-sm text-neutral-600'>Una palabra / frase por linea</p>
                            </div>
                            <button className='text-red-700' onClick={() => setShowModal(false)}>
                                X
                            </button>
                        </div>

                        <form className='flex flex-col w-full h-full gap-2'
                            onSubmit={e => {
                                e.preventDefault()
                                const form = e.target as HTMLFormElement
                                if (!form) return

                                const textarea = form[0] as HTMLTextAreaElement
                                const newWords = Array.from(new Set(textarea.value.split('\n'))) // Set ignores duplicates
                                setIgnoredWords(newWords)
                                GM_setValue('ignoredWords', newWords)
                                log('New ignored words: ', newWords.join(', '))
                                setShowModal(false)
                            }}
                        >
                            <textarea className='w-72 h-52 border-2 border-neutral-200 resize-none p-1'>
                                {ignoredWords.join('\n')}
                            </textarea>
                            <div className='w-full flex justify-end'>
                                <button className='flex p-1 rounded-md bg-green-600'>
                                    <span className='w-8 h-8 text-white'>{icons.save}</span>
                                </button>
                            </div>
                        </form>

                    </div>
                </>
            }

            <div>
                <Router>
                    <Route path='/foro/forumdisplay.php/:f?' component={() => <ForumDisplay ignoredWords={ignoredWords}
                        ignoredUsers={ignoredUsers} />} />
                    <Route path='/foro/showthread.php' component={() => <ShowThread ignoredUsers={ignoredUsers} />} />
                    <Route path='/foro/newreply.php' component={NewReply} />
                    <Route path='/foro/newthread.php' component={NewThread} />
                    <Route path='/foro/profile.php' component={(props: any) => <Profile userlist={props.userlist}
                        do_={props.do}
                        loadIgnoredUsers={loadIgnoredUsers} />} />
                </Router>
            </div>
        </div>
    )
}