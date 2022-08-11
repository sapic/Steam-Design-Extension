export default function () {
  var style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      `.publishedfile_popup_screenshot,.publishedfile_popup_screenshot>img,.profile_media_item,.imgWallItem{min-height:100px}`
    )
  )
  document.body.appendChild(style);
}
