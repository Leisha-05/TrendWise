import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDGGnOfcAng_YjgGQSkvA9yVoiFNo5D5rg",
  authDomain: "trendwise-4841a.firebaseapp.com",
  projectId: "trendwise-4841a",
  storageBucket: "trendwise-4841a.appspot.com",
  messagingSenderId: "279602370612",
  appId: "1:279602370612:web:a13540161621bb24505261",
  measurementId: "G-8XF1RBTPV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let userId = null;
let stocks = [];

const stockList = document.getElementById("bought-stocks-list");
const liveList = document.getElementById("live-prices-list");
const totalInvestedEl = document.getElementById("total-invested");
const profitLossEl = document.getElementById("profit-loss");

onAuthStateChanged(auth, user => {
  if (user) {
    userId = user.uid;
    document.getElementById('user-name').textContent = user.displayName || "N/A";
    document.getElementById('user-email').textContent = user.email || "N/A";
    listenForStocks();
  } else {
    console.log("User not logged in");
  }
});

// Get live price (simulation)
function getLivePrice(symbol) {
  return 80 + Math.random() * 420;
}

// Listen to user's stocks
function listenForStocks() {
  const userStocksRef = ref(db, `users/${userId}/stocks`);
  onValue(userStocksRef, snapshot => {
    const data = snapshot.val();
    stocks = data ? Object.entries(data).map(([key, value]) => ({ ...value, id: key })) : [];
    updateUI();
  });
}

// Add stock
document.getElementById("add-stock-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const symbol = document.getElementById("stock-symbol").value.toUpperCase();
  const qty = parseFloat(document.getElementById("stock-qty").value);
  const price = parseFloat(document.getElementById("stock-price").value);
  const date = document.getElementById("stock-date").value;

  const stock = { symbol, qty, price, date };
  const userStocksRef = ref(db, `users/${userId}/stocks`);
  push(userStocksRef, stock);

  this.reset();
});

// Remove stock
document.getElementById("remove-stock-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const symbol = document.getElementById("remove-symbol").value.toUpperCase();
  const qtyToRemove = parseFloat(document.getElementById("remove-qty").value);

  for (let stock of stocks) {
    if (stock.symbol === symbol) {
      const newQty = stock.qty - qtyToRemove;
      const stockRef = ref(db, `users/${userId}/stocks/${stock.id}`);
      if (newQty > 0) {
        update(stockRef, { qty: newQty });
      } else {
        remove(stockRef);
      }
      break;
    }
  }

  this.reset();
});
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    window.location.href = "01_index.html"; // change to your login page
  }).catch((error) => {
    console.error("Logout Error:", error);
    alert("Logout failed. Try again.");
  });
});

// Chart setup
let portfolioChart;
const chartCtx = document.getElementById('portfolioChart').getContext('2d');
portfolioChart = new Chart(chartCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FFDB58', '#FF6F91', '#6FCF97', '#9B59B6', '#6EC1E4',
        '#F39C12', '#F78FB3', '#82CCDD', '#E77F67'
      ],
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f2f2f2',
          font: { size: 14 }
        }
      }
    }
  }
});

// Update UI
function updateUI() {
  stockList.innerHTML = "";
  liveList.innerHTML = "";

  let total = 0;
  let currentValue = 0;
  const labels = [];
  const values = [];

  stocks.forEach(stock => {
    const { symbol, qty, price, date } = stock;
    const livePrice = getLivePrice(symbol);
    const investment = qty * price;

    total += investment;
    currentValue += qty * livePrice;

    const li = document.createElement("li");
    li.textContent = `${symbol} - Qty: ${qty}, Bought @ ₹${price.toFixed(2)} on ${date}`;
    stockList.appendChild(li);

    const liLive = document.createElement("li");
    liLive.textContent = `${symbol}: ₹${livePrice.toFixed(2)} (x${qty})`;
    liveList.appendChild(liLive);

    labels.push(symbol);
    values.push(investment);
  });

  const diff = currentValue - total;
  totalInvestedEl.textContent = total.toFixed(2);
  profitLossEl.textContent = `₹${diff.toFixed(2)}`;
  profitLossEl.className = diff > 0 ? "green" : diff < 0 ? "red" : "neutral";

  if (portfolioChart) {
    portfolioChart.data.labels = labels;
    portfolioChart.data.datasets[0].data = values;
    portfolioChart.update();
  }
}

// Optional: Refresh UI every 5 seconds
setInterval(updateUI, 5000);
