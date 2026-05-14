const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "6a0570b4250b1311c34a78c1";
const MASTER_KEY = "$2a$10$F.ipe65sspz5F3YYIepN9O.oI4mx.vN4uo05hSMQrLKcXp548nKnu";

let expenses = [];

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");

// =======================
// LOAD (GET from JSONBin)
// =======================
async function loadExpenses() {
    try {
        const res = await axios.get
            (`${BASE_JSON_BIN_URL}/b/${BIN_ID}`)
            // {
            //     headers: {
            //         "X-Master-Key": MASTER_KEY
            //     }
            // }
    

    expenses = res.data.record.expenses || [];

    displayExpenses();
    calculateTotal();

} catch (err) {
    console.log("LOAD ERROR:", err.response?.data || err);
}
}

loadExpenses();

// =======================
// SAVE (PUT to JSONBin)
// =======================
async function saveToJSONBin() {
    try {
        const payload = {
            expenses: expenses
        };

        const res = await axios.put(
            `${BASE_JSON_BIN_URL}/${BIN_ID}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY
                }
            }
        );

        console.log("✅ SAVED TO JSONBIN:", res.data);

    } catch (err) {
        console.log("❌ SAVE ERROR:", err.response?.data || err);
    }
}

// =======================
// CREATE
// =======================
expenseForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const category = document.getElementById("expenseCategory").value;

    const expense = {
        id: Date.now(),
        name,
        amount,
        category
    };

    expenses.push(expense);

    displayExpenses();
    calculateTotal();

    await saveToJSONBin();

    expenseForm.reset();
});

// =======================
// READ
// =======================
function displayExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(exp => {
        const div = document.createElement("div");
        div.classList.add("expense-item");

        div.innerHTML = `
            <div>
                <h5>${exp.name}</h5>
                <p>${exp.category} | $${exp.amount}</p>
            </div>

            <div>
                <button onclick="editExpense(${exp.id})">Edit</button>
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </div>
        `;

        expenseList.appendChild(div);
    });
}

// =======================
// TOTAL
// =======================
function calculateTotal() {
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }

    totalAmount.textContent = total.toFixed(2);
}

// =======================
// DELETE
// =======================
async function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);

    displayExpenses();
    calculateTotal();

    await saveToJSONBin();
}

// =======================
// UPDATE
// =======================
async function editExpense(id) {
    const exp = expenses.find(e => e.id === id);

    const newName = prompt("New name", exp.name);
    const newAmount = prompt("New amount", exp.amount);

    if (newName && newAmount) {
        exp.name = newName;
        exp.amount = parseFloat(newAmount);

        displayExpenses();
        calculateTotal();

        await saveToJSONBin();
    }
}