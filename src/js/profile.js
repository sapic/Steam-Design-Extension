import getJsonData from './getJsonData'

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
    el.appendChild(getBadgeHtml(config.url, config.href, config.text))
  }
}

function getBadgeHtml(url, href, text) {
  // `
  //   <div class="profile_in_game persona offline sapicbadge">
  //     <div class="profile_in_game_header" style="color: white;font-size: 17px;">
  //       <img src="${url}" style="width: 60px; height: 60px;">
  //       <a class="hoverunderline" href="${href}" style="position: relative;bottom: 25px;left: 15px; color: white;">${text}</a>
  //     </div>
  //   </div>
  // `

  const badge = document.createElement("div")
  badge.className = "profile_in_game persona offline sapicbadge"

  const header = document.createElement("div")
  header.className = "profile_in_game_header"
  header.style = "color: white;font-size: 17px;"

  const headerImg = document.createElement("img")
  headerImg.src = url
  headerImg.style = "width: 60px; height: 60px;"

  const hover = document.createElement("a")
  hover.className = "hoverunderline"
  hover.href = href
  hover.style = "position: relative;bottom: 25px;left: 15px; color: white;"
  hover.appendChild(document.createTextNode(text))

  header.appendChild(headerImg)
  header.appendChild(hover)

  badge.appendChild(header)

  return badge
}

async function checkDesignerStatus() {
  var script = document.createElement('script');
  script.appendChild(
    document.createTextNode(
      `document.head.innerHTML += '<param id=\"steamID\" value=\"'+ g_rgProfileData.steamid + '\">'`
    )
  )
  document.body.appendChild(script)

  const idContainer = document.getElementById("steamID")
  if (!idContainer) {
    return
  }

  const id = idContainer.getAttribute("value")
  if (!id) {
    return
  }

  const data = await getJsonData()
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

export default checkDesignerStatus
