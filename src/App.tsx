import { useEffect, useRef, useState } from 'preact/hooks'
import { useApi } from './api'
import Router, { Route } from 'preact-router'
import ForumDisplay from './Pages/ForumDisplay'
import ShowThread from './Pages/ShowThread'
import NewReply from './Pages/NewReply'
import NewThread from './Pages/NewThread'
import * as icons from './Icons'
import { log } from './utils'
import Profile from './Pages/Profile'
import { SettingsModal } from './Settings'
import { createPortal } from 'preact/compat'
import { Tag } from '..'
import { DEFAULT_CATEGORIES } from './tagger/tagger'

function IgnoredWords({ closeModal, ignoredWords, setIgnoredWords }: { closeModal: () => void; ignoredWords: string[]; setIgnoredWords: (words: string[]) => void }) {
  return (
    <>
      <div className="mb-2 flex w-full flex-col">
        <h1 className="text-lg">Palabras ignoradas</h1>
        <p className="text-sm text-neutral-600">Una palabra / frase por linea</p>
      </div>
      <form
        className="flex h-full w-full flex-col gap-2"
        onSubmit={(e) => {
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
        <textarea className="h-52 w-72 resize-none border-2 border-neutral-200 p-1">{ignoredWords.join('\n')}</textarea>
        <div className="flex w-full justify-end">
          <button className="flex rounded-md bg-emerald-600 p-1 hover:bg-emerald-700">
            <span className="h-8 w-8 text-white">{icons.save}</span>
          </button>
        </div>
      </form>
    </>
  )
}

function IgnoredUsers({ ignoredUsers, loadIgnoredUsers }: { ignoredUsers: string[]; loadIgnoredUsers: () => Promise<void> }) {
  const [loadingUsers, setLoadingUsers] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col">
        <h1 className="text-lg">Usuarios ignorados</h1>
        <p className="text-sm">Estos son tus usuarios ignorados</p>
      </div>

      <textarea disabled className="h-52 w-72 resize-none border-2 border-neutral-200 p-1 text-neutral-500">
        {ignoredUsers.join('\n')}
      </textarea>
      <div className="flex w-full justify-end gap-2">
        <button
          className="group flex rounded-md bg-emerald-600 p-1 hover:bg-emerald-700"
          title="Ir a lista de ignorados"
          onClick={() => {
            open('https://forocoches.com/foro/profile.php?do=ignorelist', '_blank')
          }}
        >
          <span className="h-8 w-8 text-white group-disabled:animate-spin">{icons.pencil}</span>
        </button>
        <button
          className="group flex rounded-md bg-emerald-600 p-1 hover:bg-emerald-700"
          disabled={loadingUsers}
          title="Recargar usuarios"
          onClick={async () => {
            setLoadingUsers(true)
            await loadIgnoredUsers()
            setLoadingUsers(false)
          }}
        >
          <span className="h-8 w-8 text-white group-disabled:animate-spin">{icons.reload}</span>
        </button>
      </div>
    </div>
  )
}

function TagControl({ tag }: { tag: Tag }) {
  return (
    <div className="tag-control flex items-center gap-1">
      <input type="string" className="w-32 rounded-md border border-neutral-400 px-1 py-0.5" placeholder="Categoria" value={tag.name} />

      <input type="color" className="rounded-md border border-neutral-400" title={tag.color} value={tag.color} />

      <input type="text" className="line-clamp-1 h-7 w-full rounded-md border border-neutral-400 px-1 py-0.5 focus:absolute" value={tag.description ?? ''} />
    </div>
  )
}

function Tags({ tags, setTags }: { tags: Tag[]; setTags: (tags: Tag[]) => void }) {
  return (
    <>
      <div className="mb-2 flex w-full flex-col">
        <h1 className="text-lg">Categorias</h1>
      </div>
      <form
        className="flex h-full w-full flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement
          const tagControls = form.querySelectorAll('.tag-control')
          if (!tagControls) return

          const newTags: Tag[] = []
          for (const tagControl of tagControls) {
            const inputs = tagControl.querySelectorAll<HTMLInputElement>('input')
            newTags.push({
              name: inputs[0].value,
              color: inputs[1].value,
              description: inputs[2].value,
            })
          }

          setTags(newTags)
          GM_setValue('tags', newTags)
        }}
      >
        <div className="flex flex-col gap-1">
          {tags.map((tag) => (
            <div className="flex gap-1">
              <TagControl tag={tag} />
              <button
                className="text-red-700"
                onClick={() => {
                  const newTags = tags.filter((t) => t.name != tag.name)
                  setTags(newTags)
                }}
              >
                X
              </button>
            </div>
          ))}

          <button
            className="flex h-8 w-8 justify-center rounded-md bg-emerald-600 p-0.5 text-2xl text-white hover:bg-emerald-700"
            onClick={() => {
              setTags([...tags, { name: '', color: '', description: '' }])
            }}
          >
            +
          </button>
        </div>

        <div className="flex w-full justify-end">
          <button className="flex rounded-md bg-emerald-600 p-1 hover:bg-emerald-700">
            <span className="h-8 w-8 text-white">{icons.save}</span>
          </button>
        </div>
      </form>
    </>
  )
}

function MenuButton({ image, showMenu, setShowMenu }: { image: HTMLImageElement; showMenu: boolean; setShowMenu: (value: boolean) => void }) {
  const [showButton, setShowButton] = useState(false)
  let timeout: ReturnType<typeof setTimeout>
  image.removeAttribute('title')

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-full"
      title={`Menu de usuario.
Manten el mouse o haz ctrl+click para ver el menu de fc-plus.`}
      onMouseEnter={() => (timeout = setTimeout(() => setShowButton(true), 1500))}
      onMouseLeave={() => {
        clearTimeout(timeout)
        setShowButton(false)
      }}
      onClick={(e) => {
        clearTimeout(timeout)
        if (e.ctrlKey && !showMenu) {
          setShowMenu(true)
          e.preventDefault()
          e.stopPropagation()
        } else if (showMenu) {
          setShowMenu(false)
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <button
        className={`header-profile-image absolute bg-neutral-200 transition-all duration-500 ${showButton ? 'translate-x-0' : 'translate-x-full'} `}
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Roto2.svg/240px-Roto2.svg.png" />
      </button>
      <div dangerouslySetInnerHTML={{ __html: image.outerHTML }} />
    </div>
  )
}

export default function App({ profileButton }: { profileButton: HTMLButtonElement }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showModal, setShowModal] = useState<'words' | 'users' | 'settings' | 'tags' | false>(false)
  const [ignoredWords, setIgnoredWords] = useState<string[]>(GM_getValue('ignoredWords', []))
  const [ignoredUsers, setIgnoredUsers] = useState<string[]>(GM_getValue('ignoredUsers', []))
  const [tags, setTags] = useState<Tag[]>(GM_getValue('tags', DEFAULT_CATEGORIES))
  const { getIgnoredUsers } = useApi()
  const img = useRef(profileButton.querySelector('img') as HTMLImageElement)
  const buttonContainer = useRef(document.createElement('div'))

  useEffect(() => {
    img.current.replaceWith(buttonContainer.current)
  }, [])

  async function loadIgnoredUsers() {
    return new Promise<void>((resolve) =>
      getIgnoredUsers((users) => {
        if (JSON.stringify(users) != JSON.stringify(ignoredUsers)) {
          setIgnoredUsers(users)
          GM_setValue('ignoredUsers', users)
        }
        resolve()
      }),
    )
  }

  return (
    <div className="text-md text-neutral-700">
      {createPortal(<MenuButton image={img.current} showMenu={showMenu} setShowMenu={setShowMenu} />, buttonContainer.current)}
      {(showMenu || showModal) && (
        <>
          <div
            className={`fixed left-0 top-0 z-10 h-full w-full`}
            onClick={() => {
              setShowMenu(false)
              setShowModal(false)
            }}
          />

          <div className={`fixed right-[10px] top-[60px] z-20 min-h-40 min-w-32 overflow-y-auto rounded-lg bg-white ${showMenu ? 'flex' : 'hidden'} flex-col justify-between border-[1px] border-neutral-300 p-3 shadow-md shadow-neutral-400`}>
            <div className="flex flex-col gap-1.5">
              <div
                className="flex cursor-pointer items-center gap-1.5 border-b-0 border-neutral-200 hover:text-emerald-600"
                onClick={() => {
                  setShowModal('words')
                  setShowMenu(false)
                }}
              >
                <span className="w-5">{icons.pencil}</span>
                Palabras ignoradas
              </div>
              <div
                className="flex cursor-pointer items-center gap-1.5 border-b-0 border-neutral-200 hover:text-emerald-600"
                onClick={() => {
                  setShowModal('users')
                  setShowMenu(false)
                }}
              >
                <span className="w-5">{icons.user}</span>
                Usuarios ignorados
              </div>

              <div
                className="flex cursor-pointer items-center gap-1.5 border-b-0 border-neutral-200 hover:text-emerald-600"
                onClick={() => {
                  setShowModal('tags')
                  setShowMenu(false)
                }}
              >
                <span className="w-5">{icons.AI}</span>
                Categorias con IA
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                className="w-5 hover:text-emerald-600"
                onClick={() => {
                  setShowModal('settings')
                  setShowMenu(false)
                }}
              >
                {icons.settings}
              </button>
            </div>
          </div>

          <div className={`fixed left-1/2 top-[80px] z-20 -translate-x-1/2 rounded-md bg-white p-2 shadow-md shadow-neutral-400 ${showModal ? 'flex' : 'hidden'} flex-col items-center`}>
            <div className="-mt-1 mb-2 flex w-full justify-end border-b-2 border-neutral-100">
              <button className="text-red-700" onClick={() => setShowModal(false)}>
                X
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {showModal == 'words' && <IgnoredWords closeModal={() => setShowModal(false)} ignoredWords={ignoredWords} setIgnoredWords={setIgnoredWords} />}
              {showModal == 'users' && <IgnoredUsers ignoredUsers={ignoredUsers} loadIgnoredUsers={loadIgnoredUsers} />}
              {showModal == 'tags' && <Tags tags={tags} setTags={setTags} />}
              {showModal == 'settings' && <SettingsModal closeModal={() => setShowModal(false)} />}
            </div>
          </div>
        </>
      )}

      <div>
        <Router>
          <Route path="/foro/forumdisplay.php/:f?" component={() => <ForumDisplay ignoredWords={ignoredWords} ignoredUsers={ignoredUsers} tags={tags} />} />
          <Route path="/foro/showthread.php" component={() => <ShowThread ignoredUsers={ignoredUsers} />} />
          <Route path="/foro/newreply.php" component={NewReply} />
          <Route path="/foro/newthread.php" component={NewThread} />
          <Route path="/foro/profile.php" component={(props: any) => <Profile do_={props.do} loadIgnoredUsers={loadIgnoredUsers} />} />
        </Router>
      </div>
    </div>
  )
}
