function addViewOnSapic(parentId) {
  const itemActions = document.getElementById(parentId)
  const viewFullButton = itemActions.firstChild

  if (isElement(viewFullButton)) {
    let href = viewFullButton.getAttribute('href');
    const bgLink = /public\/images\/items/.test(href);
    const httpLink = /cdn.akamai.steamstatic.com/.test(href);
    if (httpLink) {
      href = href.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
    }
    if (bgLink) {// && !(itemActions).find(".inv_sapic_button:not(#iteminfo" + id + "_item_actions)").length) {
      itemActions.innerHTML += '<a class="inv_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>'
    }
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
