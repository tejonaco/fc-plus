import App from "./App";
import { awaitElement } from "./utils";
import { render } from "preact";
import './index.css'
import { SettingsProvider } from "./Settings";


async function main() {
  const root = await awaitElement('body') as HTMLDivElement
  const profileButton = await awaitElement('#usercptools') as HTMLButtonElement
  const container = document.createElement("div");
  root.appendChild(container)

  render(
    <SettingsProvider>
      <App profileButton={profileButton}/>
    </SettingsProvider>
    ,
    container
  );
}


async function loadCSS () {
  const style = GM_getResourceText('css')
  GM_addStyle(style)
}


main()
loadCSS()