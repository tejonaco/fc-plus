import { ComponentChildren, createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { save } from './Icons'

type Settings = typeof DefaultSettings
type SettingsContexOutput = [Settings, (settings: Partial<Settings>) => void]

const DefaultSettings = {
  excludeIgnoredWords: true,
  excludeIgnoredUsersThreads: true,
  excludeIgnoredUsersComments: false,
  easySocialMediaLinks: true,
  tags: {
    enable: false,
    provider: 'glhf' as 'glhf' | 'github' | 'cloudflare',
    providers: {
      glhf: {
        token: '',
      },
      github: {
        token: '',
      },
      cloudflare: {
        id: '',
        token: '',
      },
    },
  },
}

const SettingsContext = createContext<SettingsContexOutput | undefined>(undefined)

export function useSettings() {
  return useContext(SettingsContext) as SettingsContexOutput
}

export function SettingsProvider({ children }: { children: ComponentChildren }) {
  const [settings, setSettings] = useState<Settings>({ ...DefaultSettings, ...GM_getValue('settings', {}) })

  function updateSettings(update: Partial<Settings>) {
    const newSettings = { ...settings, ...update }
    setSettings(newSettings)
    GM_setValue('settings', newSettings)
  }

  return <SettingsContext.Provider value={[settings, updateSettings]}>{children}</SettingsContext.Provider>
}

export function SettingsModal({ closeModal }: { closeModal: () => void }) {
  const [settings, updateSettings] = useSettings()
  const [tagsProvider, setTagsProvider] = useState(settings.tags.provider)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col">
        <h1 className="text-lg">Configuración</h1>
      </div>

      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          updateSettings(settings)
          closeModal()
        }}
      >
        <div className="flex flex-col gap-1 rounded-md border-2 border-neutral-100 p-2">
          <label className="flex justify-end gap-1">
            Excluir palabras ignoradas:
            <input
              type="checkbox"
              defaultChecked={settings.excludeIgnoredWords}
              onChange={(e: any) => {
                settings.excludeIgnoredWords = e.target.checked
              }}
            />
          </label>
          <label className="flex justify-end gap-1">
            Excluir temas de usuarios ignorados:
            <input
              type="checkbox"
              defaultChecked={settings.excludeIgnoredUsersThreads}
              onChange={(e: any) => {
                settings.excludeIgnoredUsersThreads = e.target.checked
              }}
            />
          </label>
          <label className="flex justify-end gap-1">
            Excluir comentarios de usuarios ignorados:{' '}
            <input
              type="checkbox"
              defaultChecked={settings.excludeIgnoredUsersComments}
              onChange={(e: any) => {
                settings.excludeIgnoredUsersComments = e.target.checked
              }}
            />
          </label>
          <label className="flex justify-end gap-1" title="Al pegar enlaces de YouTube, Instagram... se convierten al formato que emplea el foro">
            Formatear enlaces RRSS:
            <input
              type="checkbox"
              defaultChecked={settings.easySocialMediaLinks}
              onChange={(e: any) => {
                settings.easySocialMediaLinks = e.target.checked
              }}
            />
          </label>

          <div className="mt-2 flex flex-col justify-end gap-1">
            <h2 className="text-center text-lg underline">Categorías con IA</h2>

            <label className="flex justify-end gap-1" title="Al pegar enlaces de YouTube, Instagram... se convierten al formato que emplea el foro">
              Habilitar categorías con IA
              <input
                type="checkbox"
                defaultChecked={settings.tags.enable}
                onChange={(e: any) => {
                  settings.tags.enable = e.target.checked
                }}
              />
            </label>

            <label className="flex w-full justify-end gap-1">
              Proveedor:
              <select
                value={settings.tags.provider}
                onChange={(e: any) => {
                  setTagsProvider(e.target.value)
                  settings.tags.provider = e.target.value
                }}
              >
                <option value="glhf">GLHF</option>
                <option value="github">GITHUB</option>
                <option value="cloudflare">CLOUDFLARE</option>
              </select>
            </label>

            {tagsProvider === 'cloudflare' && (
              <input
                type="string"
                className="w-full rounded-md border border-neutral-400 px-1 py-0.5"
                placeholder="Id"
                value={settings.tags.providers.cloudflare.id}
                onChange={(e: any) => {
                  settings.tags.providers.cloudflare.id= e.target.value
                }}
              />
            )}

            <input
              type="string"
              className="w-full rounded-md border border-neutral-400 px-1 py-0.5"
              placeholder="Token"
              value={settings.tags.providers[tagsProvider].token}
              onChange={(e: any) => {
                settings.tags.providers[tagsProvider].token = e.target.value
              }}
            />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <button className="flex rounded-md bg-emerald-600 p-1 hover:bg-emerald-700">
            <span className="h-8 w-8 text-white">{save}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
