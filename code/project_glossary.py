from __future__ import annotations

import streamlit as st


GLOSSARY = {
    "en": {
        "P(up)": "Predicted probability that the next trading day closes higher than the current day.",
        "Threshold": "Decision cutoff used to convert P(up) into a target position.",
        "Buy & Hold": "Baseline strategy that buys the asset and keeps holding it during the test period.",
        "Sharpe Ratio": "Risk-adjusted return metric based on average daily return divided by volatility.",
        "Max Drawdown": "Largest peak-to-trough decline in the cumulative return curve.",
    },
    "zh": {
        "P(up)": "模型預測下一個交易日收盤價高於目前收盤價的機率。",
        "Threshold": "將 P(up) 轉換為目標部位的決策門檻。",
        "Buy & Hold": "買進並持有標的資產的基準策略，用來比較技術指標策略是否有改善。",
        "Sharpe Ratio": "以平均日報酬除以波動度衡量的風險調整後報酬。",
        "Max Drawdown": "累積報酬曲線從高點到低點的最大跌幅。",
    },
}


def render_sticky_title_glossary(title: str, caption: str, lang: str, key_prefix: str) -> None:
    st.title(title)
    st.caption(caption)

    terms = GLOSSARY.get(lang, GLOSSARY["en"])
    with st.expander("Glossary" if lang == "en" else "名詞解釋", expanded=False):
        selected = st.selectbox(
            "Term" if lang == "en" else "名詞",
            list(terms.keys()),
            key=f"{key_prefix}_term",
        )
        st.info(terms[selected])
