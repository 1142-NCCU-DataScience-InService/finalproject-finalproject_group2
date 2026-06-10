@echo off
title 啟動本機 Streamlit 儀表板
echo 正在偵測環境與啟動 Streamlit 中，請稍候...
echo.

:: 切換至批次檔所在的目錄
cd /d "%~dp0"

:: 檢查是否安裝了 Streamlit
where streamlit >nul 2>nul
if %errorlevel% neq 0 (
    echo [錯誤] 找不到 streamlit 指令。
    echo 請確保已安裝 Python 且已執行 "pip install streamlit"。
    echo.
    pause
    exit /b
)

:: 啟動 streamlit
echo 正在執行: streamlit run code/technical_app.py
streamlit run code/technical_app.py

if %errorlevel% neq 0 (
    echo.
    echo [提示] 啟動失敗，請檢查是否已安裝所有依賴套件 (pip install -r requirements.txt)。
    pause
)
