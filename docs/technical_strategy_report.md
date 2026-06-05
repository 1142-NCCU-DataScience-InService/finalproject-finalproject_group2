# 股票技術指標：股價方向預測與交易回測

## Goal / Input

本專案的目標是使用股票歷史價格與成交量資料，建立技術指標特徵，預測下一個交易日股價是否上漲，並檢驗該預測訊號是否能形成可回測的交易策略。

目標變數定義：

```text
target = 1：下一個交易日收盤價高於目前收盤價
target = 0：下一個交易日收盤價未高於目前收盤價
```

資料來源為 Yahoo Finance，透過 `yfinance` 下載 OHLCV 資料。預設範例 ticker 為 `2330.TW`，但系統可輸入任意 Yahoo Finance 支援的股票代號。

## Feature Engineering

使用的技術指標與特徵如下：

| Feature | Description |
|---|---|
| `return_1d` | 單日報酬率 |
| `ma_5` | 5 日移動平均 |
| `ma_20` | 20 日移動平均 |
| `ma_ratio` | `ma_5 / ma_20` |
| `bias_5` | 收盤價相對 5 日均線偏離程度 |
| `bias_20` | 收盤價相對 20 日均線偏離程度 |
| `vol_chg` | 成交量變化率 |
| `rsi_14` | 14 日 RSI |
| `macd` | MACD |
| `macd_signal` | MACD signal |
| `macd_hist` | MACD histogram |

資料清理會將無限值轉成缺值，並移除 rolling window、報酬率、以及 next-day target 造成的缺值列。

## Modeling

候選模型包含：

* `LogisticRegression_Ridge`: StandardScaler + L2 Logistic Regression。
* `PCA_LogReg`: StandardScaler + PCA + Logistic Regression。
* `RandomForest`: 使用多棵決策樹學習非線性技術指標規則。
* `XGBoost`: 若環境有安裝 `xgboost`，會加入梯度提升樹模型。

資料依時間順序切成 Train / Validation / Test。模型只在 training split 訓練；validation split 用於模型與 threshold 選擇；test split 用於最後的樣本外評估。

## Backtesting

模型輸出 `P(up)` 後，交易規則將機率轉換成目標部位。dashboard 版本支援動態槓桿：

```text
P(up) >= 0.60      -> 2.0x
threshold <= P(up) < 0.60 -> 1.0x
P(up) <= 0.40      -> -1.0x
otherwise          -> 0.0x
```

回測會納入交易成本，並計算策略與 Buy & Hold 的累積報酬曲線。

## Results

分類指標：

* Accuracy
* Precision
* Recall
* F1 score

投資績效指標：

* Strategy total return
* Buy & Hold total return
* Strategy maximum drawdown
* Strategy Sharpe ratio
* Entry count
* Holding ratio
* Total trading cost

目前專案以 Buy & Hold 作為 null model。若技術指標策略在 test split 上有更高報酬、更低回撤或更好的 Sharpe ratio，代表模型訊號相對基準策略有改善；但仍需要用 walk-forward validation、bootstrap confidence interval、交易成本敏感度分析等方式檢查穩健性。

## Demo

```bash
streamlit run code/technical_app.py
```

Demo 流程：

1. 輸入股票 ticker、日期範圍、validation/test 比例與交易成本。
2. 執行資料下載、技術指標計算與資料切分。
3. 訓練多個候選模型。
4. 在 validation split 搜尋最佳模型與 threshold。
5. 在 test split 顯示分類與交易績效。
6. 比較策略與 Buy & Hold 累積報酬。
7. 輸出最新一筆資料對下一交易日的 `P(up)` 與目標部位。
