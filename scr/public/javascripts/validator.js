//Password
function changeTypePass(inputId, iconId) {
  let password = document.getElementById(inputId);
  let icon = document.getElementById(iconId);
  if (password.type == "password") {
    password.type = "text";
    icon.className = "fa-solid fa-eye-slash"; // Change to eye-slash
  } else {
    password.type = "password";
    icon.className = "fa-solid fa-eye"; // Change to eye
  }
}
// Đối tượng `Validator`
function Validator(options) {
  //Lấy thẻ ngoài cùng (form-group), phòng trường hợp quá nhiều thẻ ngoài
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  // Hàm thực hiện validate
  function Validate(inputElement, rule) {
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);
    var errorMessage;

    // Lấy ra các rules của selector
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule & kiểm tra
    // Nếu có errorMessage thì dừng việc kiểm tra và trả về
    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }
    return !errorMessage;
  }

  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isFormValid = true;
      // Lặp qua từng rules và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = Validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        var enableInputs = formElement.querySelectorAll("[name]");
        var formValues = Array.from(enableInputs).reduce(function (
          values,
          input //chuyển về array thể reduce(lấy value)
        ) {
          values[input.name] = input.value;
          return values;
        }, {}); //Nếu 1 input không được nhập, vẫn trả về full
        options.onSubmit(formValues);
      }
    };

    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach(function (rule) {
      // Lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          //Value nhận: inputElement.value
          //Test function: rule.test
          Validate(inputElement, rule);
        };

        // Xử lý mỗi khi người dùng nhập lại vào input
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    });
  }
}

// Rules
// 1. Có lỗi => message lỗi
// 2. Hợp lệ => undefined

//{message || "(message muốn trả về)" }: có mesage thì trả về, không thì trả về "(message muốn trả về)" (dùng cho check error)

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim()
        ? undefined
        : message || "Error during checking";
    },
  };
};
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Error during checking";
    },
  };
};
Validator.isminLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Fill at lease ${min} leters`;
    },
  };
};
Validator.isConfirmed = function (selector, getComfirmedValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value == getComfirmedValue()
        ? undefined
        : message || "Error during checking";
    },
  };
};