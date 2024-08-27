import App from "./App";
import { awaitElement } from "./utils";
import { render } from "preact";
import './index.css'


async function main() {
  // EDIT THIS TO INSERT CONTAINER ON THE RIGHT PLACE
  const parent = await awaitElement('#root');
  const container = document.createElement("div");
  parent.appendChild(container)

  insertElement(App, container)
}


async function loadCSS () {
  const style = GM_getResourceText('css')
  GM_addStyle(style)
}


async function insertElement(Element: React.ComponentType, container: HTMLElement) {
    render(<Element />,
      container
    );
}

document.addEventListener('DOMContentLoaded', () => {
  main()
  loadCSS()
});