// Dashboard Application Controller
document.addEventListener("DOMContentLoaded", () => {
  let reportData = null;
  let equityChartInstance = null;
  let currentTicker = "2330.TW";

  // Cache DOM elements
  const activeTickerNameEl = document.getElementById("active-ticker-name");
  const activeTickerDescEl = document.getElementById("active-ticker-desc");
  const metricMLReturnEl = document.getElementById("metric-ml-return");
  const metricBHReturnEl = document.getElementById("metric-bh-return");
  const metricMLMddEl = document.getElementById("metric-ml-mdd");
  const metricMLSharpeEl = document.getElementById("metric-ml-sharpe");
  const metricMLTradesEl = document.getElementById("metric-ml-trades");
  
  const comparisonRowsEl = document.getElementById("ticker-comparison-rows");
  const overallSummaryRowsEl = document.getElementById("overall-summary-rows");
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");

  // Load report data from window.REPORT_DATA (loaded via report_data.js script tag to prevent CORS block on local files)
  reportData = window.REPORT_DATA;
  if (reportData) {
    initDashboard();
  } else {
    activeTickerDescEl.innerText = "資料載入失敗，請確認 docs/data/report_data.js 是否正確生成並載入。";
  }

  // Initialization function
  function initDashboard() {
    if (!reportData) return;

    // 1. Populate the overall summary table
    populateOverallSummary(reportData.overall_summary);

    // 2. Set up sidebar click listeners
    sidebarButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const clickedBtn = e.currentTarget;
        
        // Remove active class from all buttons
        sidebarButtons.forEach(b => b.classList.remove("active"));
        
        // Add active class to clicked button
        clickedBtn.classList.add("active");
        
        // Update active ticker and refresh dashboard
        currentTicker = clickedBtn.getAttribute("data-ticker");
        updateTickerDashboard(currentTicker);
      });
    });

    // 3. Render initial ticker dashboard
    updateTickerDashboard(currentTicker);
  }

  // Populate overall summary table
  function populateOverallSummary(summaryList) {
    if (!summaryList || summaryList.length === 0) return;
    
    overallSummaryRowsEl.innerHTML = "";
    
    summaryList.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight: 600; color: #ffffff;">${item.config}</td>
        <td style="text-align: right;">${item.ml_accuracy}</td>
        <td style="text-align: right;">${item.ml_f1}</td>
        <td style="text-align: right; font-weight: 700; color: #38bdf8;">${item.ml_return}</td>
        <td style="text-align: right; color: ${item.ml_excess.startsWith('+') ? 'var(--success)' : 'var(--danger)'};">${item.ml_excess}</td>
        <td style="text-align: right; font-weight: 700; color: #c084fc;">${item.alwaysup_return}</td>
        <td style="text-align: right; color: ${item.alwaysup_excess.startsWith('+') ? 'var(--success)' : 'var(--danger)'};">${item.alwaysup_excess}</td>
        <td style="text-align: right; font-weight: 700; color: #f87171;">${item.random_return}</td>
        <td style="text-align: right; color: ${item.random_excess.startsWith('+') ? 'var(--success)' : 'var(--danger)'};">${item.random_excess}</td>
      `;
      overallSummaryRowsEl.appendChild(tr);
    });
  }

  // Update specific stock dashboard
  function updateTickerDashboard(ticker) {
    const tickerInfo = reportData.tickers[ticker];
    if (!tickerInfo) return;

    // 1. Update text metadata
    activeTickerNameEl.innerText = tickerInfo.name;
    activeTickerDescEl.innerText = tickerInfo.description;

    // 2. Update metric cards (from Best ML)
    const mlMetrics = tickerInfo.metrics["Best ML"];
    const bhMetrics = tickerInfo.metrics["Buy & Hold"];
    
    metricMLReturnEl.innerText = mlMetrics.return;
    metricBHReturnEl.innerText = bhMetrics.return;
    
    // Max Drawdown (MDD) formatting check
    metricMLMddEl.innerText = mlMetrics.mdd;
    metricMLSharpeEl.innerText = mlMetrics.sharpe;
    metricMLTradesEl.innerText = mlMetrics.trades;

    // Check color formatting for positive/negative return values
    setMetricColor(metricMLReturnEl, parseFloat(mlMetrics.return));
    setMetricColor(metricBHReturnEl, parseFloat(bhMetrics.return));

    // 3. Update Comparison Table
    updateComparisonTable(tickerInfo.metrics);

    // 4. Update and Redraw Chart
    updateChart(tickerInfo.dates, tickerInfo.curves);
  }

  // Helper function to color metric text based on value
  function setMetricColor(el, val) {
    if (val > 0) {
      el.className = "metric-value positive";
    } else if (val < 0) {
      el.className = "metric-value negative";
    } else {
      el.className = "metric-value";
    }
  }

  // Update specific stock comparison table
  function updateComparisonTable(metrics) {
    comparisonRowsEl.innerHTML = "";
    
    const strategies = [
      { key: "Best ML", class: "ml", label: "最佳 ML 模型" },
      { key: "AlwaysUp", class: "alwaysup", label: "AlwaysUp (2x槓桿)" },
      { key: "Random", class: "random", label: "Random (隨機交易)" },
      { key: "Buy & Hold", class: "bh", label: "Buy & Hold" }
    ];

    strategies.forEach(strat => {
      const data = metrics[strat.key];
      const tr = document.createElement("tr");
      
      // Select description text based on the strategy
      let desc = "";
      if (strat.key === "Best ML") {
        desc = `在風控與報酬間取得極佳平衡，顯著將 MDD 收斂在可控範圍，Sharpe 表現卓越。`;
      } else if (strat.key === "AlwaysUp") {
        desc = `2x 槓桿在牛市中獲利極高，但代價是承受了翻倍的最大回撤風險。`;
      } else if (strat.key === "Random") {
        desc = `頻繁變更持倉導致嚴重的交易摩擦成本（10 bps），吞噬了絕大部分獲利。`;
      } else if (strat.key === "Buy & Hold") {
        desc = `被動持有大盤/個股的對比基準線，回撤與交易頻率最低。`;
      }

      tr.innerHTML = `
        <td class="table-strategy-name ${strat.class}">${data.model_name}</td>
        <td style="text-align: right;">${data.accuracy}</td>
        <td style="text-align: right;">${data.f1}</td>
        <td style="text-align: right; font-weight: 700;">${data.return}</td>
        <td style="text-align: right; color: var(--danger);">${data.mdd}</td>
        <td style="text-align: right; font-weight: 500;">${data.sharpe}</td>
        <td style="text-align: right;">${data.trades}</td>
        <td style="color: var(--text-secondary); font-size: 13px;">${desc}</td>
      `;
      comparisonRowsEl.appendChild(tr);
    });
  }

  // Render and update Chart.js
  function updateChart(dates, curves) {
    const ctx = document.getElementById("equity-chart").getContext("2d");
    
    // Destroy previous chart instance if exists
    if (equityChartInstance) {
      equityChartInstance.destroy();
    }

    const datasets = [
      {
        label: "最佳 ML 策略",
        data: curves["Best ML"],
        borderColor: "#0ea5e9",
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.08
      },
      {
        label: "AlwaysUp (2x槓桿)",
        data: curves["AlwaysUp"],
        borderColor: "#8b5cf6",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.08
      },
      {
        label: "Random (隨機交易)",
        data: curves["Random"],
        borderColor: "#ef4444",
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.08
      },
      {
        label: "Buy & Hold",
        data: curves["Buy & Hold"],
        borderColor: "#eab308",
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.08
      }
    ];

    equityChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            display: false // We use our own HTML legends
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#f3f4f6",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            padding: 12,
            titleFont: {
              family: "'Inter', 'Noto Sans TC'",
              size: 13,
              weight: "bold"
            },
            bodyFont: {
              family: "'Inter', 'Noto Sans TC'",
              size: 12
            },
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(3) + "x";
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.04)"
            },
            ticks: {
              color: "#9ca3af",
              font: {
                family: "Inter",
                size: 10
              },
              maxTicksLimit: 12
            }
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.04)"
            },
            ticks: {
              color: "#9ca3af",
              font: {
                family: "Inter",
                size: 11
              },
              callback: function (value) {
                return value.toFixed(1) + "x";
              }
            }
          }
        }
      }
    });
  }
});
