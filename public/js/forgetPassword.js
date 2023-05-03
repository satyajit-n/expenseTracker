const myFormForgotPassword = document.getElementById("my-form-forgotPassword");

myFormForgotPassword.addEventListener("submit", onSubmitForgetPassword);

function onSubmitForgetPassword(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  let myObj = {
    email: email,
  };

  axios
    .post("http://localhost:3000/password/forget-password", myObj)
    .then((res) => {
      console.log(res);
      alert(res.data.message);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
      document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
    });
}
