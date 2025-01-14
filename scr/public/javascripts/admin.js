function Admin(option) {
  var form = document.getElementById(option.form);
  form.onsubmit = function (e) {
    e.preventDefault();
    var enableInput = form.querySelectorAll("[name]");
    var formValue = Array.from(enableInput).reduce(function (value, input) {
      value[input.name] = input.value;
      return value;
    }, {});
    option.onSubmit(formValue);
  };
}