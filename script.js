document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const appContainer = document.createElement("div");
  appContainer.className = "container";
  root.appendChild(appContainer);

  // Toggle Dark Mode
  const toggleDarkModeButton = document.getElementById('toggleDarkMode');
  toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleDarkModeButton.innerHTML = document.body.classList.contains('dark-mode') 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
    // Update chart colors
    updateChartColors();
  });

  // Buttons for Chart Type
  const lineChartBtn = document.getElementById('lineChartBtn');
  const barChartBtn = document.getElementById('barChartBtn');
  const exportCSVBtn = document.getElementById('exportCSVBtn');

  lineChartBtn.addEventListener('click', () => renderTransactionGraph(selectedCustomer, transactions, 'line'));
  barChartBtn.addEventListener('click', () => renderTransactionGraph(selectedCustomer, transactions, 'bar'));

  exportCSVBtn.addEventListener('click', () => exportToCSV(transactions, selectedCustomer));

  const customers = [
    { id: 1, name: "Ahmed Ali" },
    { id: 2, name: "Aya Elsayed" },
    { id: 3, name: "Mina Adel" },
    { id: 4, name: "Sarah Reda" },
    { id: 5, name: "Mohamed Sayed" },
  ];

  const transactions = [
    { customer_id: 1, date: "2022-01-01", amount: 1000 },
    { customer_id: 1, date: "2022-01-02", amount: 2000 },
    { customer_id: 2, date: "2022-01-01", amount: 850 },
    { customer_id: 2, date: "2022-01-02", amount: 1000 },
    { customer_id: 3, date: "2022-01-01", amount: 750 },
    { customer_id: 3, date: "2022-01-02", amount: 1000 },
    { customer_id: 4, date: "2022-01-01", amount: 500 },
    { customer_id: 4, date: "2022-01-02", amount: 250 },
    { customer_id: 5, date: "2022-01-01", amount: 1575 },
    { customer_id: 5, date: "2022-01-02", amount: 1800 },
  ];

  const renderCustomerTable = (customers, transactions, setSelectedCustomer) => {
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-responsive";
    appContainer.appendChild(tableContainer);

    const table = document.createElement("table");
    table.className = "table table-bordered text-center";
    tableContainer.appendChild(table);

    const thead = document.createElement("thead");
    table.appendChild(thead);
    const headerRow = document.createElement("tr");
    thead.appendChild(headerRow);

    const idHeader = document.createElement("th");
    idHeader.textContent = "ID";
    headerRow.appendChild(idHeader);

    const nameHeader = document.createElement("th");
    nameHeader.textContent = "Name";
    headerRow.appendChild(nameHeader);

    const startDateHeader = document.createElement("th");
    startDateHeader.textContent = "Start Date";
    headerRow.appendChild(startDateHeader);

    const endDateHeader = document.createElement("th");
    endDateHeader.textContent = "End Date";
    headerRow.appendChild(endDateHeader);

    const startAmountHeader = document.createElement("th");
    startAmountHeader.textContent = "Start Amount";
    headerRow.appendChild(startAmountHeader);

    const endAmountHeader = document.createElement("th");
    endAmountHeader.textContent = "End Amount";
    headerRow.appendChild(endAmountHeader);

    const totalHeader = document.createElement("th");
    totalHeader.textContent = "Total Transactions";
    headerRow.appendChild(totalHeader);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const renderTable = (customers, transactions, setSelectedCustomer) => {
      tbody.innerHTML = "";
      customers.forEach((customer) => {
        const row = document.createElement("tr");
        row.addEventListener("click", () => setSelectedCustomer(customer));
        tbody.appendChild(row);

        const idCell = document.createElement("td");
        idCell.textContent = customer.id;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = customer.name;
        row.appendChild(nameCell);

        const startDateCell = document.createElement("td");
        startDateCell.textContent = "2022-01-01";
        row.appendChild(startDateCell);

        const endDateCell = document.createElement("td");
        endDateCell.textContent = "2022-01-02";
        row.appendChild(endDateCell);

        const startAmountCell = document.createElement("td");
        const startAmount = transactions
          .filter(transaction => transaction.customer_id === customer.id && transaction.date === "2022-01-01")
          .reduce((acc, transaction) => acc + transaction.amount, 0);
        startAmountCell.textContent = `$${startAmount}`;
        row.appendChild(startAmountCell);

        const endAmountCell = document.createElement("td");
        const endAmount = transactions
          .filter(transaction => transaction.customer_id === customer.id && transaction.date === "2022-01-02")
          .reduce((acc, transaction) => acc + transaction.amount, 0);
        endAmountCell.textContent = `$${endAmount}`;
        row.appendChild(endAmountCell);

        const totalCell = document.createElement("td");
        const customerTransactions = transactions.filter(
          (transaction) => transaction.customer_id === customer.id
        );
        const totalAmount = customerTransactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        );
        totalCell.textContent = `$${totalAmount}`;
        row.appendChild(totalCell);
      });
    };

    renderTable(customers, transactions, setSelectedCustomer);

    document.getElementById("searchInput").addEventListener("input", filterTable);

    function filterTable() {
      const searchTerm = document.getElementById("searchInput").value.toLowerCase();
      const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm)
      );
      renderTable(filteredCustomers, transactions, setSelectedCustomer);
    }
  };

  const renderTransactionGraph = (selectedCustomer, transactions, chartType = 'line') => {
    const existingGraphContainer = document.querySelector(".chart-container");
    if (existingGraphContainer) {
      existingGraphContainer.remove();
    }

    const graphContainer = document.createElement("div");
    graphContainer.className = "chart-container";
    appContainer.appendChild(graphContainer);

    const h3 = document.createElement("h3");
    h3.textContent = `Transactions for ${selectedCustomer.name}`;
    graphContainer.appendChild(h3);

    const chartDiv = document.createElement("div");
    chartDiv.className = "transaction-graph";
    graphContainer.appendChild(chartDiv);

    const customerTransactions = transactions
      .filter((transaction) => transaction.customer_id === selectedCustomer.id)
      .map((transaction) => ({
        date: transaction.date,
        amount: transaction.amount,
      }));

    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = "transactionChart";
    chartDiv.appendChild(chartCanvas);

    new Chart(chartCanvas.getContext("2d"), {
      type: chartType,
      data: {
        labels: customerTransactions.map((transaction) => transaction.date),
        datasets: [
          {
            label: "Amount",
            data: customerTransactions.map((transaction) => transaction.amount),
            borderColor: chartType === 'line' ? "#007bff" : "#007bff",
            backgroundColor: chartType === 'bar' ? "#007bff" : "rgba(0, 123, 255, 0.2)",
            fill: chartType === 'line',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (context) => `Amount: $${context.raw}`,
            },
          },
        },
      },
    });
  };

  const exportToCSV = (transactions, customer) => {
    // Filter transactions for the selected customer
    const customerTransactions = transactions.filter(transaction => transaction.customer_id === customer.id);

    // Start Date and End Date
    const startDate = "2022-01-01";
    const endDate = "2022-01-02";

    // Calculate start and end amounts
    const startAmount = customerTransactions
      .filter(transaction => transaction.date === startDate)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const endAmount = customerTransactions
      .filter(transaction => transaction.date === endDate)
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    // Calculate total amount
    const totalAmount = customerTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );

    // CSV Header
    const header = ["Customer ID", "Name", "", "", "", ""];
    const subHeader = ["ID", "Name", "Start Date", "End Date", "Start Amount", "End Amount", "Total Transactions"];
    const rows = [
      [customer.id, customer.name, "", "", "", ""],
      ["", "", startDate, endDate, `$${startAmount}`, `$${endAmount}`, `$${totalAmount}`],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [header.join(","), "", subHeader.join(","), ""];
    csvContent += rows.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${customer.name}_data.csv`);
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link)
  };

  let selectedCustomer = customers[0];
  renderCustomerTable(customers, transactions, (customer) => {
    selectedCustomer = customer;
    renderTransactionGraph(selectedCustomer, transactions, 'line');
  });

  renderTransactionGraph(selectedCustomer, transactions, 'line'); 
  // Function to update chart colors based on dark mode
  function updateChartColors() {
    const chartCanvas = document.getElementById('transactionChart');
    if (chartCanvas) {
      const chart = Chart.getChart(chartCanvas);
      if (chart) {
        chart.options.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
        chart.data.datasets[0].borderColor = document.body.classList.contains('dark-mode') ? '#ffcc00' : '#007bff';
        chart.data.datasets[0].backgroundColor = document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 123, 255, 0.2)';
        chart.update();
      }
    }
  }
  updateChartColors();
});
