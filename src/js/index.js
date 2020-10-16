import InventoryHandler from './inventory'
import ProfileHandler from './profile'
import UploadHandler from './upload'
import MarketHandler from './market'

window.addEventListener('load', function () {
  const href = window.location.href

  if (/\/market\/listings\/753\//.test(href)) {
    MarketHandler()
  } else if (/\/inventory\//.test(href)) {
    InventoryHandler()
  } else if (/\/sharedfiles\/edititem\/767\/3/.test(href)) {
    UploadHandler()
  } else if (/\/profiles\//.test(href) || /\/id\//.test(href)) {
    ProfileHandler()
  }
})

