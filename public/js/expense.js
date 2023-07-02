const myFormExpenseAdd = document.getElementById("my-form-add-expense");
const token = localStorage.getItem("token");
const buyPremium = document.getElementById("rzp-button1");
const premiumuser = document.getElementById("premiumuser");
const showboard = document.getElementById("showboard");
const downloadExpense = document.getElementById("download-expense");
const expenseBoard = document.getElementById("expense-board");
const tableExpense = document.getElementById("tableexpense");
const fileUploaded = document.getElementById("file-uploaded");
const pagination = document.getElementById("pagination");
myFormExpenseAdd.addEventListener("submit", onsubmitExpense);

let currentPage = 1;
const resultsPerPage = 2;

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

function showListOfDownload(url) {
  const parentEle = document.getElementById("list-of-download");
  const childEle = document.createElement("li");

  childEle.className = "li";

  childEle.textContent =
    "URL => " + url.URL + "------ Created AT => " + url.createdAt;

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
const displayedExpenses = [];

function removeFromScreen() {
  const parentEle = document.getElementById("lisOfExpenseItem");
  displayedExpenses.forEach((childEle) => {
    parentEle.removeChild(childEle);
  });
  displayedExpenses.length = 0;
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
  displayedExpenses.push(childEle);

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
      if (res.status === 200) {
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

document.getElementById("file-uploaded").onclick = async function (e) {
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showlistofdownload",
      { headers: { Authorization: token } }
    );
    for (var i = 0; i < response.data.length; i++) {
      showListOfDownload(response.data[i]);
    }
  } catch (err) {
    console.log(err);
  }
};

function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}) {
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.addEventListener("click", () => getProducts(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener("click", () => getProducts(currentPage));
  pagination.appendChild(btn1);

  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", () => getProducts(nextPage));
    pagination.appendChild(btn3);
  }
}

async function getProducts(page) {
  try {
    const response = await axios.get(
      `http://localhost:3000/expense/get-expense?page=${page}`,
      {
        headers: { Authorization: token },
        params: { ITEMS_PER_PAGE: 3 },
      }
    );
    console.log(response);
    removeFromScreen();
    for (let i = 0; i < response.data.expenses.length; i++) {
      showExpenseOnLoad(response.data.expenses[i]);
    }
    showPagination(response.data);

    // console.log(data.allExpenses);
    // const data = await response.json();
    // return data.allExpenses;
    // for (var i = 0; i < res.data.allExpenses.length; i++) {
    //   showExpenseOnLoad(res.data.allExpenses[i]);
    // }
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
}

// function renderExpenses(expenses) {
//   const lisOfExpenses = document.getElementById("lisOfExpenseItem");
//   lisOfExpenses.innerHTML = "";
//   expenses.forEach((expense) => {
//     const expenseElement = document.createElement("div");
//     expenseElement.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;
//     lisOfExpenses.appendChild(expenseElement);
//   });
// }

// function renderPagination(totalPages) {
//   pagination.innerHTML = "";

//   for (let page = 1; page <= totalPages; page++) {
//     const li = document.createElement("li");
//     li.textContent = page;
//     if (page === currentPage) {
//       li.classList.add("active");
//     }
//     li.addEventListener("click", () => {
//       currentPage = page;
//       fetchAndRenderData();
//     });
//     pagination.appendChild(li);
//   }
// }

// async function fetchAndRenderData() {
//   const expense = await getProducts(currentPage);
//   renderExpenses(expense);
// }

async function getUsers() {
  try {
    const res = await axios.get("http://localhost:3000/user/get-user", {
      headers: { Authorization: token },
    });
    if (res.data.isPremium) {
      buyPremium.style.display = "none";
      expenseBoard.hidden = false;
      downloadExpense.hidden = false;
      premiumuser.hidden = false;
      showboard.hidden = false;
      fileUploaded.hidden = false;
    }
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  const page = 1;
  getProducts(page);
  // fetchAndRenderData();
  getUsers();
});
