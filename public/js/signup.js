const myFormSignup = document.querySelector("#my-form-signup");

myFormSignup.addEventListener("submit", onSubmitSignup);

function onSubmitSignup(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let myObj = {
    name: name,
    email: email,
    password: password,
  };

  axios
    .post("http://localhost:3000/user/add-user", myObj)
    .then((res) => {
      alert(res.data.message);
      location.reload();
    })
    .catch((err) => {
      //   document.body.innerHTML =
      //     document.body.innerHTML + "<h2>User Already Exists<h2/>";
      alert(err.data.message);
      console.log(err);
    });
}
