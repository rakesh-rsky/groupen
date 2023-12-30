$("#login-form").validate({
  rules: {
    login_name: {
      required: true,
      minlength: 3,
      maxlength: 15,
    },
  },
  messages: {
    login_name: {
      required: "This field is required.",
      minlength: "Please enter at least 3 characters.",
      maxlength: "Please enter no more than 15 characters.",
    },
  },
});

$("#search-user-form").validate({
  rules: {
    user_search: {
      required: true,
      minlength: 2,
    },
  },

  messages: {
    user_search: {
      required: "This field is required.",
      minlength: "Please enter at least 2 characters.",
    },
  },
});

$("#signup-form").validate({
  rules: {
    name: {
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    username: {
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    password: {
      required: true,
      minlength: 6,
      maxlength: 15,
    },
    email: {
      required: true,
      email: true,
    },
  },
  messages: {
    name: {
      required: "This field is required.",
      minlength: "Please enter at least 3 characters.",
      maxlength: "Please enter no more than 15 characters.",
    },
    username: {
      required: "This field is required.",
      minlength: "Please enter at least 3 characters.",
      maxlength: "Please enter no more than 15 characters.",
    },
    password: {
      required: "This field is required.",
      minlength: "Please enter at least 6 characters.",
      maxlength: "Please enter no more than 15 characters.",
    },
    email: {
      required: "This field is required.",
      email: "Please enter valid email",
    },
  },
});
