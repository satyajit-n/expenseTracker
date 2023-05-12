const myFormExpenseAdd = document.getElementById("my-form-add-expense");
const token = localStorage.getItem("token");
const buyPremium = document.getElementById("rzp-button1");
const premiumuser = document.getElementById("premiumuser");
const showboard = document.getElementById("showboard");
const downloadExpense = document.getElementById("download-expense");
const expenseBoard = document.getElementById("expense-board");
const tableExpense = document.getElementById("tableexpense");
myFormExpenseAdd.addEventListener("submit", onsubmitExpense);

function onsubmitExpense(e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  // console.log(userId);

  let myObj = {
    amount: amount,
    description: description,
    category: category,
    userId: token,
  };

  axios
    .post("http://localhost:3000/expense/add-expense", myObj, {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res);
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

function showLeaderBoard(user) {
  const parentEle = document.getElementById("lisOfUser");
  const childEle = document.createElement("li");

  childEle.className = "li";

  childEle.textContent =
    "Name - " + user.name + "----- Total Cost - " + user.total_cost;

  parentEle.appendChild(childEle);
}

function showExpenseBoard(expense) {
  const table = document.getElementById("tablebody");
  tableExpense.hidden = false;

  //creating single row
  var row = table.insertRow();

  //creating first cell in row & inserting data
  var date = row.insertCell(0);
  var d = String(expense.createdAt).replace("T", " - ");
  date.innerHTML = d;

  //creating second cell in row & inserting data
  var description = row.insertCell(1);
  description.innerHTML = expense.description;

  //creating third cell in row & inserting data
  var category = row.insertCell(1);
  category.innerHTML = expense.category;

  //creating fourth cell in first row & inserting data
  var amount = row.insertCell(1);
  amount.innerHTML = expense.amount;
}

function showExpenseOnLoad(expense) {
  // console.log(expense.userId)
  const parentEle = document.getElementById("lisOfExpenseItem");
  const childEle = document.createElement("li");
  const delExpense = document.createElement("input");

  childEle.className = "li";

  delExpense.type = "button";
  delExpense.value = "Delete Expense";
  delExpense.className = "delbutton";

  childEle.textContent =
    expense.amount + " --- " + expense.description + " --- " + expense.category;

  parentEle.appendChild(childEle);
  childEle.appendChild(delExpense);

  delExpense.onclick = () => {
    axios
      .delete(`http://localhost:3000/expense/delete-expense/${expense.id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

function download() {
  axios
    .get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    })
    .then((res) => {
      if (res.status === 201) {
        var a = document.createElement("a");
        a.href = res.data.fileUrl;
        a.download = "my-expense.csv";
        a.click();
      } else {
        throw new Error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

document.getElementById("rzp-button1").onclick = async function (e) {
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert("you are premium user now");
      window.location.reload();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
    console.log(response);
    await axios.post(
      "http://localhost:3000/purchase/updatestatusfailure",
      {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      },
      { headers: { Authorization: token } }
    );
    alert("Something went wrong");
  });
};

document.getElementById("showboard").onclick = async function (e) {
  await axios
    .get("http://localhost:3000/premium/showLeaderBoard", {
      headers: { Authorization: token },
    })
    .then((response) => {
      for (var i = 0; i < response.data.length; i++) {
        showLeaderBoard(response.data[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

document.getElementById("expense-board").onclick = async function (e) {
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showExpenseBoard",
      {
        headers: { Authorization: token },
      }
    );
    // console.log(response);
    for (var i = 0; i < response.data.length; i++) {
      showExpenseBoard(response.data[i]);
    }
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

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
    });
  axios
    .get("http://localhost:3000/user/get-user", {
      headers: { Authorization: token },
    })
    .then((res) => {
      // console.log(res.data.isPremium);
      if (res.data.isPremium) {
        buyPremium.style.display = "none";
        expenseBoard.hidden = false;
        downloadExpense.hidden = false;
        premiumuser.hidden = false;
        showboard.hidden = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
