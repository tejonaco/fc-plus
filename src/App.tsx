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
import { SettingsModal } from "./Settings"


function IgnoredWords({ closeModal, ignoredWords, setIgnoredWords }: {
    closeModal: () => void, ignoredWords: string[],
    setIgnoredWords: (words: string[]) => void
}) {

    return (
        <>
            <div className='flex flex-col w-full mb-2'>
                <h1 className='text-lg'>Palabras ignoradas</h1>
                <p className='text-sm text-neutral-600'>Una palabra / frase por linea</p>
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
                    closeModal()
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
        </>
    )
}


function IgnoredUsers({ ignoredUsers, loadIgnoredUsers }: {
    ignoredUsers: string[],
    loadIgnoredUsers: () => Promise<void>
}) {
    const [loadingUsers, setLoadingUsers] = useState(false)


    return (
        <div className='flex flex-col gap-2'>
            <div className='flex w-full flex-col'>
                <h1 className='text-lg'>Usuarios ignorados</h1>
                <p className='text-sm'>Estos son tus usuarios ignorados</p>
            </div>

            <textarea disabled className='w-72 h-52 border-2 border-neutral-200 resize-none p-1 text-neutral-500'>
                {ignoredUsers.join('\n')}
            </textarea>
            <div className='w-full flex justify-end'>
                <button className='flex p-1 rounded-md bg-green-600 group'
                    disabled={loadingUsers}
                    title='Recargar usuarios'
                    onClick={async () => {
                        setLoadingUsers(true)
                        log(1)
                        await loadIgnoredUsers()
                        log('2')
                        setLoadingUsers(false)
                    }}
                >
                    <span className='w-8 h-8 text-white group-disabled:animate-spin'>{icons.reload}</span>
                </button>
            </div>
        </div>
    )
}


export default function App({ profileButton }: { profileButton: HTMLButtonElement }) {
    const [showMenu, setShowMenu] = useState(true)
    const [showModal, setShowModal] = useState<'words' | 'users' | 'settings' | false>(false)
    const [ignoredWords, setIgnoredWords] = useState<string[]>(GM_getValue('ignoredWords', []))
    const [ignoredUsers, setIgnoredUsers] = useState<string[]>(GM_getValue('ignoredUsers', []))
    const { getIgnoredUsers } = useApi()

    async function loadIgnoredUsers() {
        return new Promise<void>(
            resolve => getIgnoredUsers((users) => {
                if (JSON.stringify(users) != JSON.stringify(ignoredUsers)) {
                    setIgnoredUsers(users)
                    GM_setValue('ignoredUsers', users)
                }
                resolve()
            })
        )
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
        <div className='text-md text-neutral-600'>
            {
                (showMenu || showModal) &&
                <>
                    <div className={`fixed z-10 top-0 left-0 w-full h-full bg-neutral-400 opacity-20`} onClick={() => {
                        setShowMenu(false)
                        setShowModal(false)
                    }} />

                    <div className={`fixed z-20 top-[60px] right-[10px] bg-white min-w-32 min-h-40
                            rounded-md overflow-y-auto ${showMenu ? 'flex' : 'hidden'}
                            flex-col justify-between p-2 shadow-md border-[1px] border-neutral-300 shadow-neutral-400`}

                    >
                        <div className='flex flex-col gap-1.5'>
                            <div className='border-b-0 flex gap-1.5 items-center border-neutral-200 cursor-pointer hover:text-orange-600'
                                onClick={() => {
                                    setShowModal('words')
                                    setShowMenu(false)
                                }}
                            >
                                <span className='w-5'>{icons.pencil}</span>
                                Palabras ignoradas
                            </div>
                            <div className='border-b-0 flex gap-1.5 items-center border-neutral-200 cursor-pointer hover:text-orange-600'
                                onClick={() => {
                                    setShowModal('users')
                                    setShowMenu(false)
                                }}
                            >
                                <span className='w-5'>{icons.user}</span>
                                Usuarios ignorados
                            </div>
                        </div>
                        <div className='flex items-center justify-end'>
                            <button className='w-5 hover:text-orange-600'
                                onClick={() => {
                                    setShowModal('settings')
                                    setShowMenu(false)
                                }}
                            >
                                {icons.settings}
                            </button>
                        </div>
                    </div>

                    <div className={`fixed z-20 top-[80px] left-1/2 -translate-x-1/2
                    bg-white shadow-md shadow-neutral-400 rounded-md p-2 ${showModal ? 'flex' : 'hidden'} flex-col items-center`}>
                        <div className='flex w-full justify-end -mt-1 mb-2 border-b-2 border-neutral-100'>
                            <button className='text-red-700' onClick={() => setShowModal(false)}>
                                X
                            </button>
                        </div>

                        {
                            showModal == 'words' &&
                            <IgnoredWords closeModal={() => setShowModal(false)} ignoredWords={ignoredWords} setIgnoredWords={setIgnoredWords} />
                        }
                        {
                            showModal == 'users' &&
                            <IgnoredUsers ignoredUsers={ignoredUsers} loadIgnoredUsers={loadIgnoredUsers} />
                        }
                        {
                            showModal == 'settings' &&
                            <SettingsModal closeModal={() => setShowModal(false)}/>
                        }

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
                    <Route path='/foro/profile.php' component={(props: any) => <Profile do_={props.do}
                        loadIgnoredUsers={loadIgnoredUsers} />} />
                </Router>
            </div>
        </div>
    )
}