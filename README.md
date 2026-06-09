# [Group2] 股票技術指標：股價方向預測與交易回測

本專案使用 Yahoo Finance 的股票 OHLCV 歷史資料，建立技術指標特徵，預測下一個交易日股價是否上漲，並將模型輸出的上漲機率轉換成交易部位進行回測。題目不綁定單一股票，預設範例使用 `2330.TW`，也可以在 Streamlit 介面輸入其他 Yahoo Finance ticker。

## Contributors

| Name | Student ID | GitHub Account | Contribution |
|---|---|---|---|
|劉家揚|資科在職碩一|114971002|團隊中的重要幫手🦒| 
|施政樟|資科在職碩一|114971025|團隊中的重要幫手🦒|
|游振洲|資科在職碩一|nakanonino0901|團隊中的重要幫手🦒|
|賴昱瑋|資科在職碩一|nccuhihi|團隊中的重要幫手🦒|
|林福田|資科在職碩一|futeeeen|團隊中的重要幫手🦒|

## Quick start

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the interactive dashboard:

```bash
streamlit run code/technical_app.py
```

Run the script version and export a backtest CSV:

```bash
python code/technical_system.py
```

The dashboard lets users set ticker, date range, validation/test ratios, threshold search range, and transaction cost. The script version uses `2330.TW` as an example ticker and writes `backtest_result.csv`.

## Folder organization and its related description

### docs

* `technical_strategy_report.pdf`: original technical-strategy report copied from the working project.
* `technical_strategy_report.md`: cleaned project note for this GitHub submission.
* Final presentation file: to be added as `1142_DS-IS-FP_group2.pptx` or PDF before submission.

### data

* Input source: Yahoo Finance.
* Access method: `yfinance.download()`.
* Format: downloaded at runtime as a pandas DataFrame containing `Open`, `High`, `Low`, `Close`, and `Volume`.
* Size: depends on the selected ticker and date range. With the default 2015-01-01 to 2026-01-01 setting, the cleaned feature table contains daily trading records after rolling-window missing values are removed.
* Storage policy: raw market data is not committed because it can be reproduced from Yahoo Finance through the code.

### code

* `technical_system.py`: data download, feature engineering, model training, evaluation, and script-mode backtest export.
* `technical_app.py`: Streamlit dashboard for parameter setting, model comparison, threshold search, equity curves, diagnostics, lifecycle explanation, and CSV download.
* `project_glossary.py`: small Streamlit helper for glossary display.

Analysis steps:

1. Download OHLCV data for the selected ticker.
2. Build technical features: daily return, 5/20-day moving-average ratio, 5/20-day bias, volume change, RSI(14), MACD, MACD signal, and MACD histogram.
3. Define the binary target: `target = 1` if next-day close is higher than current close, otherwise `0`.
4. Split data by time order into training, validation, and test sets.
5. Train candidate models on training data only.
6. Select threshold/model using validation-set strategy return.
7. Report final classification metrics and backtest metrics on the test set.

Methods and packages:

* Data: `yfinance`, `pandas`, `numpy`.
* Models: `scikit-learn` Logistic Regression with L2 regularization, PCA + Logistic Regression, Random Forest, and optional `xgboost` when installed.
* Interface: `streamlit`.

Training and evaluation:

* The project uses chronological train/validation/test splitting instead of random cross-validation, because stock data is time-ordered.
* Validation data is used for model and threshold selection.
* Test data is held out for the final out-of-sample report.

Null model for comparison:

* The null model is Buy & Hold: buy the selected stock and hold it throughout the test period.
* Strategy performance is compared with Buy & Hold using total return, maximum drawdown, and Sharpe ratio.

### results

Performance is produced dynamically by the dashboard or script because it depends on ticker, date range, costs, and threshold settings.

Reported metrics:

* Classification: accuracy, precision, recall, and F1 score.
* Trading/backtest: strategy total return, Buy & Hold total return, maximum drawdown, Sharpe ratio, entry count, holding ratio, and total trading cost.

Significance and limitations:

* The current version compares out-of-sample test performance against Buy & Hold, but does not yet include statistical significance tests.
* Recommended extensions include walk-forward validation, bootstrap confidence intervals, sensitivity analysis for transaction costs, and robustness checks across multiple stocks and market regimes.

## References

* pandas development team. pandas documentation.
* NumPy developers. NumPy documentation.
* scikit-learn developers. scikit-learn documentation.
* yfinance package documentation.
* Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system.
* Wilder, J. W. (1978). New Concepts in Technical Trading Systems.
* Murphy, J. J. (1999). Technical Analysis of the Financial Markets.
