$(function () {
  let emailInp = $('input[name="email"]');
  let nick = $('input[name="nick"]');
  let btnForm = $(".one-screen__form .btn");

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
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

  emailInp.focusout(function () {
    if (!isEmail($(this).val())) {
      $(this).parent().addClass("error");
    }
  });

  nick.keyup(function () {
    nickVal = nick.val();
    if (nickVal.length > 0) {
      $.ajax({
        url: "http://zenit.staffboost.ru/api/auth/register/nick",
        type: "POST",
        data: { nick: nickVal },
        dataType: "html",
      })
        .done(function (data) {
          console.log("success");
          var objData = jQuery.parseJSON(data);
          if (!objData.success) {
            nick.parent().addClass("error");
          }
          if (objData.success) {
            nick.parent().removeClass("error");
          }
        })
        .fail(function (data) {
          nick.parent().addClass("error");
          console.log(data);
        });
    }
  });

  $(".one-screen__email-code").on("click", function () {
    let email = emailInp.val();

    if (isEmail(email)) {
      $.ajax({
        url: "http://zenit.staffboost.ru/api/auth/register/email",
        type: "POST",
        data: { email: email },
        dataType: "html",
      })
        .done(function (data) {
          console.log("success");
          console.log(data);
          alert("Код отправлен на ваш email");
        })
        .fail(function (data) {
          emailInp.parent().addClass("error");
          alert("Ошибка отправки");
        });
    } else {
      emailInp.parent().addClass("error");
    }
  });

  $(".form-reg").submit(function (event) {
    var data_form = $(this).serializeObject();
    data_form.email = $.trim(data_form.email.toLowerCase());
    var data_form_json = 'email='+ data_form.email +'&code='+ data_form.code+ '&name='+data_form.name+'&nick='+data_form.nick;

    $.ajax({
      url: "http://zenit.staffboost.ru/api/auth/register/data",
      type: "POST",
      data: data_form_json,
      // data: data_form,
      dataType: "html",
    })
      .done(function (data) {
        let dataJson = $.parseJSON(data);
        localStorage.setItem('userNick', dataJson.authentication.nick);
        localStorage.setItem('userToken', dataJson.authentication.token);
        goToUrl();
      })
      .fail(function (data) {
        alert("Ошибка регистрации");
        console.log(data);
      });
    return false;
  });

  $(".form-signin").submit(function (event) {
    var data_form = $(this).serializeObject();
    data_form.email = $.trim(data_form.email.toLowerCase());
    var data_form_json = 'email='+ data_form.email +'&code='+ data_form.code;
    
    $.ajax({
      url: "http://zenit.staffboost.ru/api/auth/register/login",
      type: "POST",
      // data: data_form,
      data: data_form_json,
      dataType: "html",
    })
      .done(function (data) {
        let dataJson = $.parseJSON(data)
        console.log(dataJson);
        localStorage.setItem('userNick', dataJson.authentication.nick);
        localStorage.setItem('userToken', dataJson.authentication.token);
        goToUrl();
      })
      .fail(function (data) {
        alert("Ошибка входа");
        console.log(data);
      });
    return false;
  });

  $("input").focus(function () {
    $(this).parent().removeClass("error");
  });
  $("input").keyup(function () {
    var boolInp = true;

    $("input").each(function () {
      if ($(this).val().length < 2 || $(this).parent().hasClass("error")) {
        boolInp = false;
      }
    });

    if (boolInp) {
      btnForm.removeClass("btn-disabled").addClass("btn-blue");
    } else {
      btnForm.removeClass("btn-blue").addClass("btn-disabled");
    }
  });
});

function goToUrl(){
  var url = "http://zenit.staffboost.ru/public/root/streem.html";
  $(location).attr('href',url);
}

// document.addEventListener('DOMContentLoaded', function(){
//   if(localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') != 'undefined'){
//     goToUrl();
//   }
// });