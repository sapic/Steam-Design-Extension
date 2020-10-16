function longImageButton() {
  const selectElement = document.getElementById('PreviewImage');
  const widthInput = document.getElementById('image_width')
  const heightInput = document.getElementById('image_height')

  selectElement.addEventListener('load', (event) => {
    widthInput.value = 1000
    heightInput.value = 1
  });
}

function scmSapicButton() {
  const buttonContainer = document.getElementById("largeiteminfo_item_actions")//.find("a:not(.es_preview_background)");
  const viewFullButton = buttonContainer.firstChild

  if (isElement(viewFullButton)) {
    let href = viewFullButton.getAttribute("href")
    const httpLink = /cdn.akamai.steamstatic.com/.test(href);
    const bgLink = /public\/images\/items/.test(href);
    if (httpLink) {
      href = href.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
    }
    if (bgLink) {
      buttonContainer.innerHTML += '<a class="scm_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>'
    }
  }
}

function invSapicButton() {
  const iteminfo1_item_icon = document.getElementById('iteminfo1_item_icon')
  iteminfo1_item_icon.onload = function () {
    invSapicButton_2(1);
  }

  const iteminfo0_item_icon = document.getElementById('iteminfo0_item_icon')
  iteminfo0_item_icon.onload = function () {
    invSapicButton_2(0);
  }
}

function invSapicButton_2(id) {
  const itemActions = document.getElementById(`iteminfo${id}_item_actions`)
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

// function settingsSapicButton() {
//   var url = $('#profile_background_current_image').attr("src");
//   if (url) {
//     settingsSapicButton_2();
//     $('#profile_background_current_image').on('load', function () {
//       settingsSapicButton_2();
//     });
//   }
// }

// function settingsSapicButton_2() {
//   var sapicButton = $(".settings_sapic_button");
//   var url = $('#profile_background_current_image').attr("src");
//   var httpLink = /cdn.akamai.steamstatic.com/.test(url);
//   url = url.replace("?size=140x90&v=2", "");
//   if (httpLink) {
//     url = url.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
//   }
//   if (sapicButton) {
//     sapicButton.remove();
//   }
//   $(".background_selector_launch_area").find(".btn_grey_white_innerfade.btn_small").first().before('<a class="settings_sapic_button btn_small btn_grey_white_innerfade" style="margin-right: 10px;" target="_blank" href="https://steam.design/#' + url + '"><span>View on Steam.Design</span></a>');
// }

function checkDesignerStatus() {
  var script = document.createElement('script');
  script.innerHTML = `document.body.innerHTML += '<param id=\"steamID\" value=\"'+ g_rgProfileData.steamid + '\">'`
  document.body.appendChild(script)

  const idContainer = document.getElementById("steamID")
  if (!idContainer) {
    console.log('no user info container')
    return
  }

  const id = idContainer.getAttribute("value")
  if (!id) {
    console.log('no user info')
    return
  }

  getDesignersList().then(data => {
    for (let i of data.designers) {
      if (id === i) {
        loadDesignerBanner("designer");
      }
    }
    for (let i of data.sapicstaff) {
      if (id === i) {
        loadDesignerBanner("sapic");
      }
    }
    for (let i of data.aevoa) {
      if (id === i) {
        loadDesignerBanner("aevoa");
      }
    }
    for (let i of data.donator) {
      if (id === i) {
        loadDesignerBanner("donator");
      }
    }
  }).catch(err => {
    console.log('get design err', err)
  })
}

const badgeConfig = {
  designer: {
    url: chrome.runtime.getURL("images/designer.png"),
    href: "https://designerlist.guide",
    text: "Verified Profile Designer",
  },
  sapic: {
    url: chrome.runtime.getURL("images/sapic.png"),
    href: "https://steam.design",
    text: "Steam.Design Staff",
  },
  aevoa: {
    url: chrome.runtime.getURL("images/aevoa.png"),
    href: "https://steamcommunity.com/id/Aevoa/myworkshopfiles/?section=guides",
    text: "150+ Guides Published",
  },
  donator: {
    url: chrome.runtime.getURL("images/donator.png"),
    href: "https://steam.design",
    text: "Steam.Design Donator",
  },
}

function loadDesignerBanner(banner) {
  if (badgeConfig[banner]) {
    const config = badgeConfig[banner]
    const el = document.getElementsByClassName("responsive_status_info")[0]
    el.innerHTML += getBadgeHtml(config.url, config.href, config.text)
  }
}

function getBadgeHtml(url, href, text) {
  return `
    <div class="profile_in_game persona offline sapicbadge">
      <div class="profile_in_game_header" style="color: white;font-size: 17px;">
        <img src="${url}" style="width: 60px; height: 60px;">
        <a class="hoverunderline" href="${href}" style="position: relative;bottom: 25px;left: 15px; color: white;">${text}</a>
      </div>
    </div>
  `
}

window.addEventListener('load', function () {
  const href = window.location.href

  if (/\/market\/listings\/753\//.test(href)) {
    scmSapicButton();
  } else if (/\/inventory\//.test(href)) {
    invSapicButton();
    // } else if (/\/id\/.*\/edit/.test(href) || /\/profiles\/.*\/edit/.test(href)) {
    // settingsSapicButton();
  } else if (/\/sharedfiles\/edititem\/767\/3/.test(href)) {
    longImageButton();
  } else if (/\/profiles\//.test(href) || /\/id\//.test(href)) {
    checkDesignerStatus();
  }
});

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

function getDesignersList() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['designers'], function (result) {
      if (result && result.designers && result.designers.set_at) {
        const timeSpent = Date.now() - result.designers.set_at
        if (timeSpent < 60 * 60 * 24 * 1000) { // cache for 24 hours
          return resolve(result.designers)
        }
      }

      fetch("https://raw.githubusercontent.com/sapic/Steam-Design-Extension/master/designers.json")
        .then(r => r.json())
        .then(function (data) {
          chrome.storage.sync.set({
            designers: {
              ...data,
              set_at: Date.now(),
            }
          }, function () {
            resolve(data)
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}
