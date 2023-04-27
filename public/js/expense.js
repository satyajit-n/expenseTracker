const myFormExpenseAdd = document.getElementById("my-form-add-expense");

myFormExpenseAdd.addEventListener("submit", onsubmitExpense);
function onsubmitExpense(e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const userId = localStorage.getItem("token");

  console.log(userId);

  let myObj = {
    amount: amount,
    description: description,
    category: category,
    userId: userId,
  };

  axios
    .post("http://localhost:3000/expense/add-expense", myObj)
    .then((res) => {
      showExpenseDetails(res.data.newExpenseDetails);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });

  function showExpenseDetails(expense) {
    const parentEle = document.getElementById("lisOfExpenseItem");
    const childEle = document.createElement("li");
    const delExpense = document.createElement("input");

    childEle.className = "li";

    delExpense.type = "button";
    delExpense.value = "Delete Expense";
    delExpense.className = "btn btn-outline-danger";

    childEle.textContent =
      expense.amount +
      " --- " +
      expense.description +
      " --- " +
      expense.category;

    parentEle.appendChild(childEle);
    childEle.appendChild(delExpense);
  }
}
function showExpenseOnLoad(expense) {
  // console.log(expense.userId)
  const parentEle = document.getElementById("lisOfExpenseItem");
  const childEle = document.createElement("li");
  const delExpense = document.createElement("input");

  childEle.className = "li";

  delExpense.type = "button";
  delExpense.value = "Delete Expense";
  delExpense.className = "btn btn-outline-danger";

  childEle.textContent =
    expense.amount + " --- " + expense.description + " --- " + expense.category;

  parentEle.appendChild(childEle);
  childEle.appendChild(delExpense);

  delExpense.onclick = () => {
    axios
      .delete(`http://localhost:3000/expense/delete-expense/${expense.id}`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/expense/get-expense", {
      headers: { Authorization: token },
    })
    .then((res) => {
      // console.log(res.data.allExpenses[2].userId);
      // console.log(localStorage.getItem("userId"));
      for (var i = 0; i < res.data.allExpenses.length; i++) {
        showExpenseOnLoad(res.data.allExpenses[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
