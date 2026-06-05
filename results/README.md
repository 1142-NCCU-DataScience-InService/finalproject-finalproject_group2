# Results

結果由 `streamlit run code/technical_app.py` 或 `python code/technical_system.py` 執行後產生。

主要輸出包含：

* 模型比較表：validation/test 的 accuracy、precision、recall、F1。
* 回測績效表：strategy return、Buy & Hold return、maximum drawdown、Sharpe ratio。
* 訊號資料表：`P(up)`、target position、strategy return、buy-and-hold return、累積報酬。
* CSV：script 版本會輸出 `backtest_result.csv`；dashboard 版本可下載 `streamlit_backtest_result.csv`。

因為結果會隨 ticker、日期區間、threshold、交易成本設定而改變，因此 repository 保留說明，不固定提交單一結果檔。
