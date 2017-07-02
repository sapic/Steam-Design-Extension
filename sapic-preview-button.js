function load() {
   var href = window.location.href;
   if (/\/market\/listings\/753\//.test(href)) {
      scmSapicButton();
   } else if (/\/inventory\//.test(href)) {
      invSapicButton();
   } else if (/\/id\/.*\/edit/.test(href) || /\/profiles\/.*\/edit/.test(href)) {
      settingsSapicButton();
   } else if(/\/sharedfiles\/edititem\/767\/3/.test(href)) {
     longImageButton();
   }
};

function longImageButton(){
  $('#PreviewImage').on('load', function () {
    $('#title').after('<div class="scm_sapic_button btn_blue_white_innerfade btn_medium" id="longImage"><span>Upload a Long Image</span></div>');
});
$('#longImage').click(function(){
  $('#image_width').val('1000');
  $('#image_height').val('1');
});
}

function scmSapicButton() {
   setTimeout(function() {
      var viewFullButton = $("#largeiteminfo_item_actions").find("a:not(.es_preview_background)");
      if (viewFullButton.length) {
         var href = viewFullButton.attr('href');
         var bgLink = /public\/images\/items/.test($(viewFullButton).attr("href"));
         if (bgLink) {
            viewFullButton.after('<a class="scm_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>');
         }
      }
   }, 300);
}

function invSapicButton() {
   setInterval(function() {
      var itemActions = $(".inventory_iteminfo").find(".item_desc_content").find(".item_desc_description").find("#iteminfo1_item_actions");
      var viewFullButton = $(itemActions).find("a").first();
      if (viewFullButton.length) {
         var bgLink = /public\/images\/items/.test($(viewFullButton).attr("href"));
         var href = viewFullButton.attr('href');
         if (bgLink && !(itemActions).find(".inv_sapic_button:not(#iteminfo0_item_actions)").length) {
            viewFullButton.after('<a class="inv_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>');
         }
      }
   }, 200);
   setInterval(function() {
      var itemActions = $(".inventory_iteminfo").find(".item_desc_content").find(".item_desc_description").find("#iteminfo0_item_actions");
      var viewFullButton = $(itemActions).find("a").first();
      if (viewFullButton.length) {
         var bgLink = /public\/images\/items/.test($(viewFullButton).attr("href"));
         var href = viewFullButton.attr('href');
         if (bgLink && !(itemActions).find(".inv_sapic_button:not(#iteminfo1_item_actions)").length) {
            viewFullButton.after('<a class="inv_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>');
         }
      }
   }, 200);
}

function settingsSapicButton() {
  var url = $('#profile_background_current_image').attr("src");
  if (url == null){
    return
  };
   setInterval(function() {
      var url = $('#profile_background_current_image').attr("src");
      var sapicButton = $(".settings_sapic_button");
      url = url.replace("?size=140x90&v=2", "");

      $(".background_selector_launch_area").find(".btn_grey_white_innerfade.btn_small").first().before('<a class="settings_sapic_button btn_small btn_grey_white_innerfade" style="margin-right: 10px;" target="_blank" href="https://steam.design/#' + url + '"><span>View on Steam.Design</span></a>');
      sapicButton.remove();
   }, 200);
}
load();
