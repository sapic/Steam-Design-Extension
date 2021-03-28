async function shopHandler() {
  addCss()

  // Select the node that will be observed for mutations
  const targetNode = document.body

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const debouncedCallback = debounce(handleDOMUpdate, 16)

  const observer = new MutationObserver(debouncedCallback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  // observer.disconnect();
}

function handleDOMUpdate() {
  addVideoLinksToModal()
}

function addVideoLinksToModal() {
  // Steam modal. Can have multiple of them, so we only ask for active
  const modal = document.querySelector('.ModalOverlayContent.active')

  if (modal) {
    // we use [class^=""] to find submatch in class, since now steam is
    // using react and class names have random symbols at the end
    // This is videl element container
    const previewContainer = modal.querySelector('[class^="redeempointsmodal_VideoPreview_"]')
    if (!previewContainer) {
      return
    }

    // Header where we append our links
    const header = modal.querySelector('[class^="redeempointsmodal_Header_"')
    if (!header) {
      return
    }

    // Check if we already added links, don't do anything then
    const existingLink = header.parentElement.querySelector('.sapic__shot-bg__link-container')
    if (existingLink) {
      return
    }

    // Get sources from video
    const sources = previewContainer.querySelectorAll('source')

    // Create links container
    const linksContainer = document.createElement('div')
    linksContainer.className = 'sapic__shot-bg__link-container'

    for (const source of sources) {
      // Create link for each of video sources
      const src = source.getAttribute('src')
      const split = src.split('.')
      const ext = split[split.length - 1]

      const link = document.createElement('a')
      link.className = 'sapic__shot-bg__link-item'
      link.innerText = ext
      link.href = src
      link.target = "_blank"
      link.rel = 'noopener noreferrer'

      linksContainer.appendChild(link)
    }

    header.parentElement.appendChild(linksContainer)
  }
}

function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

function addCss() {
  const style = document.createElement('style');
  style.innerHTML = `
    .sapic__shot-bg__link-container {
      margin: 5px -5px 0 -5px;
    }

    .sapic__shot-bg__link-item {
      margin: 0 5px;
    }
  `

  document.body.appendChild(style)
}

export default shopHandler
