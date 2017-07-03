function longImageButton() {
   $('#title').after('<div class="long_sapic_button btn_blue_white_innerfade btn_medium" id="longImage" style="display:none;"><span>Upload a Long Image</span></div>');
   $('#PreviewImage').on('load', function() {
      $('#longImage').show();
   });
}

function scmSapicButton() {
   var viewFullButton = $("#largeiteminfo_item_actions").find("a:not(.es_preview_background)");
   if (viewFullButton.length) {
      var href = viewFullButton.attr('href');
      var httpLink = /cdn.akamai.steamstatic.com/.test(href);
      var bgLink = /public\/images\/items/.test(href);
      if (httpLink) {
         href = href.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
      }
      if (bgLink) {
         viewFullButton.after('<a class="scm_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>');
      }
   }
}

function invSapicButton() {
   $('#iteminfo1_item_icon').on('load', function() {
      invSapicButton_2(1);
   });
   $('#iteminfo0_item_icon').on('load', function() {
      invSapicButton_2(0);
   });
}

function invSapicButton_2(id) {
   var itemActions = $(".inventory_iteminfo").find(".item_desc_content").find(".item_desc_description").find("#iteminfo" + id + "_item_actions");
   var viewFullButton = $(itemActions).find("a").first();
   if (viewFullButton.length) {
      var href = viewFullButton.attr('href');
      var bgLink = /public\/images\/items/.test(href);
      var httpLink = /cdn.akamai.steamstatic.com/.test(href);
      if (httpLink) {
         href = href.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
      }
      if (bgLink && !(itemActions).find(".inv_sapic_button:not(#iteminfo" + id + "_item_actions)").length) {
         viewFullButton.after('<a class="inv_sapic_button btn_small btn_grey_white_innerfade" target="_blank" href="https://steam.design/#' + href + '"><span>View on Steam.Design</span></a>');
      }
   }
}

function settingsSapicButton() {
   var url = $('#profile_background_current_image').attr("src");
   if (url) {
      settingsSapicButton_2();
      $('#profile_background_current_image').on('load', function() {
         settingsSapicButton_2();
      });
   }
}

function settingsSapicButton_2() {
   var sapicButton = $(".settings_sapic_button");
   var url = $('#profile_background_current_image').attr("src");
   var httpLink = /cdn.akamai.steamstatic.com/.test(url);
   url = url.replace("?size=140x90&v=2", "");
   if (httpLink) {
      url = url.replace("http://cdn.akamai.steamstatic.com", "https://steamcdn-a.akamaihd.net");
   }
   if (sapicButton) {
      sapicButton.remove();
   }
   $(".background_selector_launch_area").find(".btn_grey_white_innerfade.btn_small").first().before('<a class="settings_sapic_button btn_small btn_grey_white_innerfade" style="margin-right: 10px;" target="_blank" href="https://steam.design/#' + url + '"><span>View on Steam.Design</span></a>');
}

$(document).ready(function() {
   var href = window.location.href;
   if (/\/market\/listings\/753\//.test(href)) {
      scmSapicButton();
   } else if (/\/inventory\//.test(href)) {
      invSapicButton();
   } else if (/\/id\/.*\/edit/.test(href) || /\/profiles\/.*\/edit/.test(href)) {
      settingsSapicButton();
   } else if (/\/sharedfiles\/edititem\/767\/3/.test(href)) {
      longImageButton();
   }

   $('.long_sapic_button').on('click', function() {
      $('#image_width').val('1000');
      $('#image_height').val('1');
   });
});
