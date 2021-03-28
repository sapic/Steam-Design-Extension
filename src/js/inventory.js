import addViewOnSapic from './addViewOnSapic'

function invSapicButton() {
  const iteminfo1_item_icon = document.getElementById('iteminfo1_item_icon')
  iteminfo1_item_icon.onload = function () {
    addViewOnSapic('iteminfo1')
  }

  const iteminfo0_item_icon = document.getElementById('iteminfo0_item_icon')
  iteminfo0_item_icon.onload = function () {
    addViewOnSapic('iteminfo0')
  }
}

export default invSapicButton