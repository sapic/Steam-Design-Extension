function longImageButton() {
  $('#title').after('<div class="long_sapic_button btn_blue_white_innerfade btn_medium" id="longImage" style="display:none;"><span>Upload a Long Image</span></div>');
  $('#PreviewImage').on('load', function () {
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

function settingsSapicButton() {
  var url = $('#profile_background_current_image').attr("src");
  if (url) {
    settingsSapicButton_2();
    $('#profile_background_current_image').on('load', function () {
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

function checkDesignerStatus() {
  fetch("https://raw.githubusercontent.com/sapic/Steam-Design-Extension/master/designers.json")
    .then(r => r.json())
    .then(function (data) {
      $('body').append("<script id=\"idScript\">$J('#idScript').append('<param id=\"steamID\" value=\"'+ g_rgProfileData.steamid + '\">')</script>");
      var id = $('#steamID').val()

      $.each(data.designers, function () {
        if (id == this) {
          loadDesignerBanner("designer");
        }
      });

      $.each(data.sapicstaff, function () {
        if (id == this) {
          loadDesignerBanner("sapic");
        }
      });

      $.each(data.aevoa, function () {
        if (id == this) {
          loadDesignerBanner("aevoa");
        }
      });

      $.each(data.donator, function () {
        if (id == this) {
          loadDesignerBanner("donator");
        }
      });
    });

}

function loadDesignerBanner(banner) {
  switch (banner) {
    case "designer":
      var imgurl = chrome.runtime.getURL("images/designer.png");
      var href = "https://designerlist.guide";
      var text = "Verified Profile Designer";
      break;
    case "sapic":
      var imgurl = chrome.runtime.getURL("images/sapic.png");
      var href = "https://Steam.Design";
      var text = "Steam.Design Staff";
      break;
    case "aevoa":
      var imgurl = chrome.runtime.getURL("images/aevoa.png");
      var href = "https://steamcommunity.com/id/Aevoa/myworkshopfiles/?section=guides";
      var text = "150+ Guides Published";
      break;
    case "donator":
      var imgurl = chrome.runtime.getURL("images/donator.png");
      var href = "https://Steam.Design";
      var text = "Steam.Design Donator";
      break;
  }

  var html = '<div class="profile_in_game persona offline sapicbadge"><div class="profile_in_game_header" style="color: white;font-size: 17px;"><img src="' + imgurl + '"></img><a class="hoverunderline" href="' + href + '" style="position: relative;bottom: 25px;left: 15px; color: white;">' + text + '</a></div></div>';
  $('.profile_in_game.persona').not($('.sapicbadge')).after(html);
}

$(document).ready(function () {
  $.ajaxSetup({ cache: false });
  var href = window.location.href;
  if (/\/market\/listings\/753\//.test(href)) {
    scmSapicButton();
  } else if (/\/inventory\//.test(href)) {
    invSapicButton();
  } else if (/\/id\/.*\/edit/.test(href) || /\/profiles\/.*\/edit/.test(href)) {
    settingsSapicButton();
  } else if (/\/sharedfiles\/edititem\/767\/3/.test(href)) {
    longImageButton();
  } else if (/\/profiles\//.test(href) || /\/id\//.test(href)) {
    checkDesignerStatus();
  }

  $('.long_sapic_button').on('click', function () {
    $('#image_width').val('1000');
    $('#image_height').val('1');
    $(this).hide();
  });
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