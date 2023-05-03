const myFormForgotPassword = document.getElementById("my-form-forgotPassword");

myFormForgotPassword.addEventListener("submit", onSubmitForgetPassword);

function onSubmitForgetPassword(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  let myObj = {
    email: email,
  };

  axios
    .post("http://localhost:3000/password/forgotpassword", myObj)
    .then((res) => {})
    .catch((err) => {
      console.log(err);
      document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
    });
}
