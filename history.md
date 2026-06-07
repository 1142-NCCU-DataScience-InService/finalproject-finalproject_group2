# Project Push Change Log

## 2026.06.07_23:54:23
* Added a dashboard switch for 1-day original direction prediction versus 5-day direction prediction with two-day signal confirmation.
* Added an optional volatility-feature switch using ATR ratio, 20-day volatility, 20-day volume ratio, and Bollinger Band width.
* Generated report experiment outputs for 6 tickers x 4 configurations, including aggregate comparison tables and a final PPTX report deck.
* Validation: ran python -m py_compile code\technical_system.py code\technical_app.py; ran smoke tests for 5-day confirmation with and without volatility features; exported and package-checked the PPTX report.
