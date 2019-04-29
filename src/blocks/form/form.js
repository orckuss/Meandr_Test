$(".js-submit").click(function(evt) {
  var inputRequired = $(".input[required]");
  for (var i = 0; i < inputRequired.length; i++) {
    $(inputRequired[i]).removeClass("input--error");
    if (!$(inputRequired[i]).val()) {
      $(inputRequired[i]).addClass("input--error");
    }
  }
  if (inputRequired.hasClass("input--error")) {
    evt.preventDefault();
    alert("Поля формы не валидны! Пожалуйста заполните так, как указано в примере");
  }
});
