const btn = document.querySelector(".btn");
const myForm = document.querySelector("#my-form");
const msg = document.querySelector(".msg");
const userList = document.querySelector("#users");
const delButton = document.querySelector(".btn:hover");

myForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
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
    .post("http://localhost:3000/expense-user/add-user", myObj)
    .then((res) => {
      window.location.reload();
      console.log(res);
    })
    .catch((err) => {
      //   document.body.innerHTML =
      //     document.body.innerHTML + "<h2>User Already Exists<h2/>";
      window.alert("user Already Exists");
      console.log(err);
    });
}
