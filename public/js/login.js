const myFormLogIn = document.querySelector("#my-form-login");

myFormLogIn.addEventListener("submit", onSubmitLogIn);

function onSubmitLogIn(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let myObj = {
    email: email,
    password: password,
  };

  axios
    .post("http://localhost:3000/user/login", myObj)
    .then((res) => {
      alert(res.data.message);
    //   console.log(res.data.token);
      localStorage.setItem("token", res.data.token);
      window.location.href = "http://127.0.0.1:5500/views/expense.html";
    })
    .catch((err) => {
      console.log(err);
      document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
    });
}
