import * as preact from 'preact'

import App from './uploader/index.jsx'

function main() {
  const el = document.createElement("div")
  el.setAttribute('id', 'uploadVue')

  // grab target element reference
  const target = document.querySelector('#SubmitItemForm > div:first-of-type');

  // insert the element before target element
  target.parentNode.insertBefore(el, target);

  preact.render(
    <App />,
    document.getElementById('uploadVue')
  );
}

main()