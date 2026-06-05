# Data

資料由程式執行時透過 Yahoo Finance 下載，不在 repository 中固定提交原始市場資料。

預設欄位：

* `Open`
* `High`
* `Low`
* `Close`
* `Volume`

可重現方式：

```python
from technical_system import download_data

df = download_data(ticker="2330.TW", start="2015-01-01", end="2026-01-01")
```

在 dashboard 中可改用其他 Yahoo Finance ticker。
