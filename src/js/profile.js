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

async function checkDesignerStatus() {
  var script = document.createElement('script');
  script.innerHTML = `document.head.innerHTML += '<param id=\"steamID\" value=\"'+ g_rgProfileData.steamid + '\">'`
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

  const data = await getDesignersList()
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

export default checkDesignerStatus