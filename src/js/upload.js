function longImageButton() {
  const selectElement = document.getElementById('PreviewImage');
  const widthInput = document.getElementById('image_width')
  const heightInput = document.getElementById('image_height')

  selectElement.addEventListener('load', (event) => {
    widthInput.value = 1000
    heightInput.value = 1
  });

  injectScript(chrome.extension.getURL('massUpload.js'), 'body');
}

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}

export default longImageButton