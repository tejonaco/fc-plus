import { ComponentChildren, createContext } from "preact"
import { useContext, useState } from "preact/hooks"
import { save } from "./Icons"
import { log } from "./utils"

type Settings = typeof DefaultSettings
type SettingsContexOutput = [Settings, (settings: Partial<Settings>) => void]

const DefaultSettings = {
  excludeIgnoredWords: true,
  excludeIgnoredUsersThreads: true,
  excludeIgnoredUsersComments: false,
  easySocialMediaLinks: true
}

const SettingsContext = createContext<SettingsContexOutput | undefined>(undefined)

export function useSettings() {
  return useContext(SettingsContext) as SettingsContexOutput
}

export function SettingsProvider({ children }: { children: ComponentChildren }) {
  const [settings, setSettings] = useState<Settings>({...DefaultSettings, ...GM_getValue('settings', {}) })

  function updateSettings(update: Partial<Settings>) {
    const newSettings = {...settings, ...update }
    setSettings(newSettings)
    GM_setValue('settings', newSettings)
  }

  return (
    <SettingsContext.Provider value={[settings, updateSettings]}>
      {children}
    </SettingsContext.Provider>
  )
}

export function SettingsModal({ closeModal }: { closeModal: () => void }) {
  const [settings, updateSettings] = useSettings()

  return (
    <div className='flex flex-col gap-2' >
      <div className='flex w-full flex-col'>
        <h1 className='text-lg'>Configuración</h1>
      </div>

      <form className='flex flex-col gap-2'
        onSubmit={e => {
          e.preventDefault()
          updateSettings(settings)
          closeModal()
        }}
      >
        <div className='flex flex-col gap-1 p-2 border-2 rounded-md border-neutral-100'>
          <label className='flex justify-end gap-1'>
            Excluir palabras ignoradas:
            <input type='checkbox' defaultChecked={settings.excludeIgnoredWords}
            onChange={(e: any) => {settings.excludeIgnoredWords = e.target.checked}} />
          </label>
          <label className='flex justify-end gap-1'>
            Excluir temas de usuarios ignorados:
            <input type='checkbox' defaultChecked={settings.excludeIgnoredUsersThreads}
            onChange={(e: any) => {settings.excludeIgnoredUsersThreads = e.target.checked}} />
          </label>
          <label className='flex justify-end gap-1'>
            Excluir comentarios de usuarios ignorados: <input type='checkbox' defaultChecked={settings.excludeIgnoredUsersComments}
            onChange={(e: any) => {settings.excludeIgnoredUsersComments = e.target.checked}} />
          </label>
          <label className='flex justify-end gap-1'
            title='Al pegar enlaces de YouTube, Instagram... se convierten al formato que emplea el foro'
          >
            Formatear enlaces RRSS:
            <input type='checkbox' defaultChecked={settings.easySocialMediaLinks}
            onChange={(e: any) => {settings.easySocialMediaLinks = e.target.checked}} />
          </label>
        </div>
        <div className='w-full flex justify-end'>
          <button className='flex p-1 rounded-md bg-emerald-600 hover:bg-emerald-700'>
            <span className='w-8 h-8 text-white'>{save}</span>
          </button>
        </div>
      </form>
    </div>
  )
}