import getJsonData from './getJsonData'

async function addViewOnSapic(blockId) {
  const itemActions = document.getElementById(`${blockId}_item_actions`)
  const viewFullButton = itemActions.firstChild

  if (!isElement(viewFullButton)) {
    return
  }

  let href = viewFullButton.getAttribute('href');
  const bgLink = /public\/images\/items/.test(href);
  const httpLink = /cdn.akamai.steamstatic.com/.test(href);
  if (httpLink) {
    href = href.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
  }
  if (bgLink) {// && !(itemActions).find(".inv_sapic_button:not(#iteminfo" + id + "_item_actions)").length) {
    const link = document.createElement('a')
    link.className = 'inv_sapic_button btn_small btn_grey_white_innerfade'
    link.target = "_blank"
    link.href = 'https://steam.design/#' + href

    const span = document.createElement('span')
    span.innerText = 'View on Steam.Design'

    link.appendChild(span)

    itemActions.appendChild(link)
  }

  addAnimatedLink(itemActions, blockId)
}

async function addAnimatedLink(itemActions, blockId) {
  const jsonData = await getJsonData()
  const itemName = itemActions.parentElement.querySelector('.hover_item_name')

  for (const animatedBg of jsonData.animatedBackgrounds) {
    if (animatedBg.internalDescription !== itemName.innerHTML) {
      continue
    }

    const tagsEl = itemActions.parentElement.parentElement.querySelector(`#${blockId}_item_tags_content`)
    if (!tagsEl) {
      continue
    }

    const tagsText = tagsEl.innerHTML
    if (!tagsText.includes(animatedBg.gamename)) {
      continue
    }

    const webmUrl = `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${animatedBg.appid}/${animatedBg.communityItemData.itemMovieWebm}`

    const link = document.createElement('a')
    link.className = 'inv_sapic_button btn_small btn_grey_white_innerfade'
    link.target = "_blank"
    link.href = `https://steam.design/#${webmUrl}`

    const span = document.createElement('span')
    span.innerText = 'View Animated on Steam.Design'

    link.appendChild(span)

    itemActions.appendChild(link)
    break
  }
}

function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  }
  catch (e) {
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj === "object") &&
      (obj.nodeType === 1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument === "object");
  }
}

export default addViewOnSapic
