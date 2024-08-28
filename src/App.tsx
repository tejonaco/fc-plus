import { useEffect, useState } from "preact/hooks"


export default function App() {
    const [showMenu, setShowMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [ignoredWords, setIgnoredWords] = useState<string[]>(GM_getValue('ignoredWords', []))

    const hasIgnoredWord = (text: string) => {
        for (const word of ignoredWords) {
            if (text.toLocaleLowerCase().includes(' ' + word.toLowerCase() + ' ')) {
                return true
            }
        }
    }

    useEffect(() => {
        const threads: NodeListOf<HTMLDivElement> = document.querySelectorAll('section > div:has(div > div > span > a)')
        for (const thread of threads) {
            const threadInfo = thread.querySelector('div > div:has(span > a)')
            if (!threadInfo) return

            const title = threadInfo.querySelector('span > a')?.textContent?.trim() ?? ''

            if (hasIgnoredWord(title)) {
                thread.style.display = 'none'

                const separator = thread.nextElementSibling
                if (separator instanceof HTMLElement && separator.tagName == 'SEPARATOR') {
                    separator.style.display = 'none'
                }

                // console.log('Thread hidden: ', title)
            }
        }

    }, [])

    return (
        <div className='relative'>
            <button className='bg-red-600 w-10 h-10 rounded-full flex items-center justify-center'
                onClick={() => setShowMenu(!showMenu)}
            >

            </button>
            <div className={`fixed z-20 top-[60px] right-[10px] bg-white min-w-32 min-h-32
                            rounded-md overflow-y-auto ${showMenu ? 'flex' : 'hidden'} flex-col p-2 shadow-md shadow-neutral-400`}>
                <button className='border-b-2 border-neutral-400'
                    onClick={() => setShowModal(true)}
                >
                    IGNORED LIST
                </button>
            </div>

            <div className={`w-60 h-60 fixed top-[80px] left-1/2 -translate-x-1/2
                    bg-white shadow-md shadow-neutral-400 rounded-md p-2 ${showModal ? 'flex' : 'hidden'} flex-col items-center gap-2`}>
                <div className='flex w-full justify-between'>
                    <h1>Ignored list</h1>
                    <button className='text-red-700' onClick={() => setShowModal(false)}>
                        X
                    </button>
                </div>
                <textarea className='w-full h-full border-2 border-neutral-200 resize-none'
                    onChange={({ target }) => {
                        const newWords = (target as HTMLTextAreaElement).value.split('\n')
                        setIgnoredWords(newWords)
                        GM_setValue('ignoredWords', newWords)
                    }}
                >
                    {ignoredWords.join('\n')}
                </textarea>
            </div>
        </div>
    )
}