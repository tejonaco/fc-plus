import App from "./App";
import { awaitElement } from "./utils";
import { render } from "preact";
import './index.css'


async function main() {
  const root = await awaitElement('body') as HTMLDivElement
  const profileButton = await awaitElement('#usercptools') as HTMLButtonElement
  const container = document.createElement("div");
  root.appendChild(container)

  render(<App profileButton={profileButton}/>,
    container
  );
}


async function loadCSS () {
  const style = GM_getResourceText('css')
  GM_addStyle(style)
}


document.addEventListener('DOMContentLoaded', () => {
  main()
  loadCSS()
});