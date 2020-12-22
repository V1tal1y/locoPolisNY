function goToUrl() {
  var url = "http://zenit.staffboost.ru/public/root/signin.html";
  $(location).attr("href", url);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log(localStorage.getItem("userToken"));
  if (
    localStorage.getItem("userToken") === null ||
    localStorage.getItem("userToken") == 'undefined'
  ) {
    console.log("fas1");
    goToUrl();
  }
});

$(function () {
  var fileVal = "";

  $(document).on("click", ".musical-vote .btn", function () {
    $(this).parents(".musical-vote__list").addClass("musical-vote__success");
  });

  let messages = $(".streem-chat__messages");

  function h_chat() {
    messages.height("0px");
    let streemChatH = messages.parent().height();
    let streemChatF = messages.next().height();
    messages.height(streemChatH - streemChatF - 10 + "px");
  }

  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || "");
      } else {
        o[this.name] = this.value || "";
      }
    });
    return o;
  };

  //   var elChatNum = 2;
  //   var elFile = '<label class="streem-chat__file btn-blue" id="streem-chat__file1"> <input type="file" name=""> </label>';

  var streemChatFiles = $(".streem-chat__files-name");
  function readURL(input, $input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        streemChatFiles.html(
          '<div class="streem-chat__file-name">' +
            input.files[0].name +
            ' <div class="streem-chat__file-close"></div></div>'
        );
        fileVal = reader.result;
        h_chat();
        // $input.parent().addClass('hide').parent().append(elFile);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $(document).on("change", ".streem-chat__file input", function () {
    readURL(this, $(this));
  });
  $(document).on("click", ".streem-chat__file-close", function () {
    $(this).parent().remove();
    h_chat();
  });

  $(window).resize(function () {
    if ($(window).width() > 1199) {
      h_chat();
      console.log($(window).width());
    } else {
      messages.height("");
      console.log($(window).width());
    }
  });

  function scrollToBottom() {
    messages.scrollTop(9999999);
  }
  h_chat();
  scrollToBottom();

  function showMassage(mParams) {
    let time = mParams.authentication.created_at.substr(11, 5);
    let messageEl =
      '<div class="streem-chat__message"><div class="streem-chat__username">' +
      mParams.authentication.nick +
      '</div><div class="streem-chat__name">' +
      mParams.authentication.name +
      "</div><p>" +
      mParams.message +
      '</p><div class="streem-chat__time">' +
      time +
      "</div></div>";
    messages.append(messageEl);
    scrollToBottom();
  }

  function getMassage() {
    $.ajax({
      url: "http://zenit.staffboost.ru/api/chat/message/get",
      type: "POST",
      data: {},
      // 'id': 6
      dataType: "html",
    })
      .done(function (data) {
        let dataJson = $.parseJSON(data);
        for (let key in dataJson.messages) {
          showMassage(dataJson.messages[key]);
        }
      })
      .fail(function (data) {
        console.log(data);
      });
  }
  getMassage();

  function sendMessage(sendData) {
    $.ajax({
      url: "http://zenit.staffboost.ru/api/chat/message/send",
      type: "POST",
      data: sendData,
      dataType: "html",
    })
      .done(function (data) {
        let dataJson = $.parseJSON(data);
        console.log("success");
        console.log(dataJson);
        getMassage();
      })
      .fail(function (data) {
        console.log(data);
      });
  }

  $(".streem-chat__form").submit(function (event) {
    var data_form = $(this).serializeObject();
    var data_form_json =
      "token=" +
      localStorage.getItem("userToken") +
      "&message=" +
      data_form.message;
    if (fileVal != "") {
      data_form_json += "&file=" + fileVal;
    }
    sendMessage(data_form_json);
    return false;
  });
});
