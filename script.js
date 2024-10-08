let totalIncome = 0;
let totalExpense = 0;
let transactions = [];
let monthlyBalances = {};  // Armazenar o balanço por mês
let annualBalance = 0;

const incomeElem = document.getElementById('totalIncome');
const expenseElem = document.getElementById('totalExpense');
const balanceElem = document.getElementById('balance');
const monthlyBalanceElem = document.getElementById('monthlyBalance');
const annualBalanceElem = document.getElementById('annualBalance');
const chartCanvas = document.getElementById('chart').getContext('2d');

function updateUI() {
    incomeElem.textContent = `R$ ${totalIncome.toFixed(2)}`;
    expenseElem.textContent = `R$ ${totalExpense.toFixed(2)}`;
    const balance = totalIncome - totalExpense;
    balanceElem.textContent = `R$ ${balance.toFixed(2)}`;
    balanceElem.style.color = balance >= 0 ? 'green' : 'red';

    updateChart();
    updateMonthlyAndAnnualBalances();
}

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const month = document.getElementById('month').value;

    if (description === "" || isNaN(amount) || month === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    transactions.push({ month, description, amount, type });

    if (type === "income") {
        totalIncome += amount;
    } else if (type === "expense") {
        totalExpense += amount;
    }

    // Atualiza tabela dinâmica
    updateTable();
    updateUI();
}

function updateChart() {
    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update();
}

function updateTable() {
    const tableBody = document.querySelector("#dynamicTable tbody");
    tableBody.innerHTML = "";  // Limpa a tabela

    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.month}</td>
            <td>${transaction.description}</td>
            <td>${transaction.type === 'income' ? 'Receita' : 'Despesa'}</td>
            <td>R$ ${transaction.amount.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateMonthlyAndAnnualBalances() {
    monthlyBalances = {}; // Reinicia os balanços mensais
    annualBalance = 0;

    transactions.forEach(transaction => {
        const month = transaction.month;
        const amount = transaction.amount;
        const isIncome = transaction.type === 'income';

        if (!monthlyBalances[month]) {
            monthlyBalances[month] = { income: 0, expense: 0 };
        }

        if (isIncome) {
            monthlyBalances[month].income += amount;
            annualBalance += amount;
        } else {
            monthlyBalances[month].expense += amount;
            annualBalance -= amount;
        }
    });

    // Exibe balanço do mês atual (último mês registrado)
    const currentMonth = document.getElementById('month').value;
    if (monthlyBalances[currentMonth]) {
        const monthlyBalance = monthlyBalances[currentMonth].income - monthlyBalances[currentMonth].expense;
        monthlyBalanceElem.textContent = `R$ ${monthlyBalance.toFixed(2)}`;
    }

    // Exibe balanço anual
    annualBalanceElem.textContent = `R$ ${annualBalance.toFixed(2)}`;
}

function exportSpreadsheet() {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transações");

    XLSX.writeFile(wb, "gestao_financeira.xlsx");
}
