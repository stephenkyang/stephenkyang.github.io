"""
Generate backtest data for the pairs trading visualization.
Imports pre-computed tradable pairs from model.py to avoid slow recomputation.

Usage: python3 scripts/generate_pairs_data.py
"""

import json
import sys
import os
import numpy as np
import pandas as pd
import yfinance as yf
import statsmodels.api as sm
import statsmodels.tsa.stattools

PAIRS_REPO = os.path.expanduser("~/Desktop/mean-reversion-pairs-trading")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(SCRIPT_DIR, "..", "public", "pairs-data.json")

# Add pairs trading repo to path and cd there (model.py reads CSVs from cwd)
sys.path.insert(0, PAIRS_REPO)
os.chdir(PAIRS_REPO)

from model import saved_tradable_pairs

num_data = pd.read_csv("historical-data.csv")
if "Date" in num_data.columns:
    num_data = num_data.set_index("Date")

data = pd.read_csv("normalized-historical-data.csv")
if "Date" in data.columns:
    data = data.set_index("Date")
data.iloc[0] = data.iloc[1]
data = data.ffill()
data = data.dropna(axis=1)

print(f"Tradable pairs: {saved_tradable_pairs}")


class TrackedSimulation(object):
    def __init__(self, days, money, reversion_time=45):
        self.day = 200
        self.days = int(days)
        self.tradable_pairs = {k: list(v) for k, v in saved_tradable_pairs.items()}
        self.money = money
        self.eliminated_pairs = {}
        self.holding_pair = False
        self.daily_values = []

        best_pair = None
        trading_info = None
        short_info = None
        long_info = None

        remaining = days
        while remaining > 200:
            if self.holding_pair and best_pair:
                short_current = num_data[best_pair[0]].iloc[self.day]
                long_current = num_data[best_pair[1]].iloc[self.day]
                unrealized = (
                    (trading_info[0] - short_current) * trading_info[1]
                    + (long_current - trading_info[2]) * trading_info[3]
                )
                portfolio_value = self.money + unrealized

                exited = False
                if short_current > short_info[0]:
                    self.money += self.sell(best_pair, *trading_info)
                    exited = True
                elif short_current < short_info[1]:
                    self.money += self.sell(best_pair, *trading_info)
                    exited = True
                elif num_data[best_pair[1]].iloc[self.day] < long_info[0]:
                    self.money += self.sell(best_pair, *trading_info)
                    exited = True
                elif num_data[best_pair[1]].iloc[self.day] > long_info[1]:
                    self.money += self.sell(best_pair, *trading_info)
                    exited = True
                elif reversion_time == 0:
                    self.money += self.sell(best_pair, *trading_info)
                    exited = True

                if exited:
                    portfolio_value = self.money
                    if best_pair[0] in self.tradable_pairs and best_pair[1] in self.tradable_pairs[best_pair[0]]:
                        self.tradable_pairs[best_pair[0]].remove(best_pair[1])
                    else:
                        self.tradable_pairs[best_pair[1]].remove(best_pair[0])
                    self.eliminated_pairs[best_pair[0]] = [best_pair[1], 100]
                    self.holding_pair = False
                    reversion_time = 30
            else:
                portfolio_value = self.money
                best_pair = self.find_best_pair(self.tradable_pairs)
                if best_pair and best_pair != []:
                    short_info = self.entry_exit_points(best_pair)[0]
                    long_info = self.entry_exit_points(best_pair)[1]
                    trading_info = self.buy(best_pair, self.money)
                    self.holding_pair = True

            self.daily_values.append(portfolio_value)
            self.day += 1
            reversion_time -= 1
            remaining -= 1
            self.timer(self.eliminated_pairs)

    def bollinger_bands(self, pair):
        combined = (data[pair[0]].iloc[self.day - 200:self.day] + data[pair[1]].iloc[self.day - 200:self.day]) / 2
        return [combined + combined.std() * 2, combined, combined - combined.std() * 2]

    def find_best_pair(self, pairs):
        best_pair = []
        minimum_ADF = 0
        for ticker in pairs:
            for other_ticker in pairs[ticker]:
                pair = [ticker, other_ticker] if data[ticker].iloc[self.day] > data[other_ticker].iloc[self.day] else [other_ticker, ticker]
                try:
                    adf_result = self.ADF_test(pair[0], pair[1])
                    eep = self.entry_exit_points(pair)
                    if (adf_result[4]["1%"] < minimum_ADF
                            and eep[0][0] > num_data[pair[0]].iloc[self.day] > eep[0][1]
                            and eep[1][0] < num_data[pair[1]].iloc[self.day] < eep[1][1]):
                        minimum_ADF = adf_result[4]["1%"]
                        best_pair = pair
                except:
                    continue
        return best_pair

    def entry_exit_points(self, pair):
        bolli_bands = self.bollinger_bands(pair)
        middle = bolli_bands[1].iloc[-1]
        t0 = data[pair[0]].iloc[self.day]
        t1 = data[pair[1]].iloc[self.day]
        s, l = pair[0], pair[1]
        if abs(middle - t0) > abs(middle - t1):
            se = [round(num_data[s].iloc[self.day] + num_data[s].iloc[self.day-200:self.day].std(), 2),
                  round(middle * num_data[s].iloc[self.day-200:self.day].std() + num_data[s].iloc[self.day-200:self.day].mean(), 2)]
            le = [round(num_data[l].iloc[self.day] - num_data[l].iloc[self.day-200:self.day].std(), 2),
                  round(middle * num_data[l].iloc[self.day-200:self.day].std() * 2 + num_data[l].iloc[self.day-200:self.day].mean(), 2)]
        else:
            se = [round(num_data[s].iloc[self.day] + num_data[s].iloc[self.day-200:self.day].std(), 2),
                  round(middle * num_data[s].iloc[self.day-200:self.day].std() * 2 + num_data[s].iloc[self.day-200:self.day].mean(), 2)]
            le = [round(num_data[l].iloc[self.day] - num_data[l].iloc[self.day-200:self.day].std(), 2),
                  round(middle * num_data[l].iloc[self.day-200:self.day].std() + num_data[l].iloc[self.day-200:self.day].mean(), 2)]
        return [se, le]

    def buy(self, pair, money):
        short_last = num_data[pair[0]].iloc[self.day]
        long_last = num_data[pair[1]].iloc[self.day]
        return [short_last, (self.money / 2) / short_last, long_last, (self.money / 2) / long_last]

    def sell(self, pair, short_original, short_amount, long_original, long_amount):
        short_last = num_data[pair[0]].iloc[self.day]
        long_last = num_data[pair[1]].iloc[self.day]
        return (short_original - short_last) * short_amount + (long_last - long_original) * long_amount

    def OLS(self, t1, t2):
        spread = sm.OLS(data[t1].iloc[self.day-200:self.day], data[t2].iloc[self.day-200:self.day]).fit()
        return data[t1] + (data[t2] * -spread.params[0])

    def ADF_test(self, t1, t2):
        return statsmodels.tsa.stattools.adfuller(self.OLS(t1, t2))

    def timer(self, pairs):
        for ticker in list(pairs.keys()):
            if pairs[ticker][1] != 0:
                pairs[ticker][1] -= 1
            else:
                if ticker in self.tradable_pairs:
                    self.tradable_pairs[ticker].append(pairs[ticker][0])
                else:
                    self.tradable_pairs[ticker] = [pairs[ticker][0]]
                pairs.pop(ticker)


if __name__ == "__main__":
    print("Running backtest simulation (1215 days, $10,000)...")
    sim = TrackedSimulation(1215, 10000)

    # Get dates from the index
    all_dates = num_data.index.tolist()
    if isinstance(all_dates[0], str):
        sim_dates = all_dates[200:200 + len(sim.daily_values)]
    else:
        sim_dates = list(range(len(sim.daily_values)))

    start_date = sim_dates[0] if isinstance(sim_dates[0], str) else None
    end_date = sim_dates[-1] if isinstance(sim_dates[-1], str) else None

    # Fetch S&P 500
    sp500_values = []
    if start_date and end_date:
        print(f"Fetching S&P 500 from {start_date} to {end_date}...")
        sp500 = yf.download("^GSPC", start=start_date, end=end_date)
        # Flatten multi-level columns if present
        if hasattr(sp500.columns, 'levels'):
            sp500.columns = sp500.columns.get_level_values(0)
        if "Close" in sp500.columns:
            close = sp500["Close"]
        else:
            close = sp500.iloc[:, 0]

        sp500_dates = close.index.strftime("%Y-%m-%d").tolist()
        sp500_raw = close.values.flatten().tolist()
        base = sp500_raw[0]
        sp500_normalized = [round((v / base) * 10000, 2) for v in sp500_raw]
        sp500_values = [{"date": d, "value": v} for d, v in zip(sp500_dates, sp500_normalized)]

    # Build output
    pairs_data = []
    for i, val in enumerate(sim.daily_values):
        entry = {"value": round(val, 2)}
        if isinstance(sim_dates[i], str):
            entry["date"] = sim_dates[i]
        else:
            entry["day"] = i
        pairs_data.append(entry)

    output = {
        "initial_investment": 10000,
        "trading_days": len(sim.daily_values),
        "final_value": round(sim.daily_values[-1], 2),
        "pairs_trading": pairs_data,
        "sp500": sp500_values,
    }

    with open(OUT_PATH, "w") as f:
        json.dump(output, f)

    pairs_return = ((sim.daily_values[-1] - 10000) / 10000) * 100
    print(f"\nPairs Trading: ${sim.daily_values[-1]:,.2f} ({pairs_return:+.1f}%)")
    if sp500_values:
        sp_return = ((sp500_values[-1]["value"] - 10000) / 10000) * 100
        print(f"S&P 500:       ${sp500_values[-1]['value']:,.2f} ({sp_return:+.1f}%)")
    print(f"\nData written to {os.path.abspath(OUT_PATH)}")
