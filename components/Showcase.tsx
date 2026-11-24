"use client";
import { useEffect, useState } from "react";
import ParticleBackground from "./ParticleBackground";
import { stocks, headlines, type Stock } from "@/lib/sample-data";
function Chart({ stock, count = 60 }: { stock: Stock; count?: number }) {
  const values = stock.history.slice(-count),
    min = Math.min(...values) - 2,
    max = Math.max(...values) + 2;
  const points = values
    .map(
      (v, i) =>
        `${(i * 600) / (values.length - 1)},${180 - ((v - min) / (max - min)) * 160}`,
    )
    .join(" ");
  return (
    <svg
      viewBox="0 0 600 200"
      role="img"
      aria-label={`${stock.name} fictional price history`}
    >
      <path
        d="M0 40H600M0 80H600M0 120H600M0 160H600"
        stroke="#26352f"
        strokeDasharray="3 5"
      />
      <polygon
        points={`0,200 ${points} 600,200`}
        fill={stock.change < 0 ? "#f1768710" : "#27dba412"}
      />
      <polyline
        points={points}
        fill="none"
        stroke={stock.change < 0 ? "#f17687" : "#27dba4"}
        strokeWidth="2.5"
      />
    </svg>
  );
}
const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
export default function Showcase() {
  const [selected, select] = useState(stocks[0]),
    [query, search] = useState(""),
    [watchlist, showWatchlist] = useState(false),
    [period, range] = useState(60),
    [saved, save] = useState<string[]>([]);
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const v: unknown = JSON.parse(
          localStorage.getItem("agora-sample-favourites") || "[]",
        );
        if (Array.isArray(v))
          save(
            v.filter(
              (x): x is string =>
                typeof x === "string" && stocks.some((s) => s.symbol === x),
            ),
          );
      } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, []);
  function toggle(symbol: string) {
    const next = saved.includes(symbol)
      ? saved.filter((x) => x !== symbol)
      : [...saved, symbol];
    save(next);
    try {
      localStorage.setItem("agora-sample-favourites", JSON.stringify(next));
    } catch {}
  }
  const filtered = stocks.filter(
    (s) =>
      (!watchlist || saved.includes(s.symbol)) &&
      `${s.symbol} ${s.name}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <ParticleBackground count={100} speed={1.2} maxOpacity={0.3} />
      <div className="shell">
        <header>
          <a className="brand" href="#main">
            <svg
              className="candles"
              viewBox="0 0 42 42"
              width="31"
              height="31"
              aria-hidden="true"
            >
              <path
                d="M7 13v24M20 9v24M33 3v24"
                stroke="#27dba4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="18"
                width="8"
                height="14"
                rx="1.4"
                fill="#27dba4"
              />
              <rect
                x="16"
                y="14"
                width="8"
                height="14"
                rx="1.4"
                fill="#e8eff3"
              />
              <rect
                x="29"
                y="8"
                width="8"
                height="14"
                rx="1.4"
                fill="#27dba4"
              />
            </svg>
            Agora <small>SHOWCASE</small>
          </a>
          <nav aria-label="Main navigation">
            <button
              aria-pressed={!watchlist}
              onClick={() => showWatchlist(false)}
            >
              Dashboard
            </button>
            <button
              aria-pressed={watchlist}
              onClick={() => showWatchlist(true)}
            >
              Watchlist ({saved.length})
            </button>
          </nav>
          <span className="local">● Local frontend</span>
        </header>
        <p className="notice">
          Portfolio edition{" "}
          <span>
            Fictional sample data · No live prices or external services
          </span>
        </p>
        <div className="ticker">
          {stocks.map((s) => (
            <button key={s.symbol} onClick={() => select(s)}>
              <b>{s.symbol}</b> ${s.price.toFixed(2)}{" "}
              <em className={s.change < 0 ? "down" : "up"}>{pct(s.change)}</em>
            </button>
          ))}
        </div>
        <main id="main">
          <div className="heading">
            <div>
              <p className="eyebrow">YOUR MARKET WORKSPACE</p>
              <h1>{watchlist ? "Your watchlist" : "Market overview"}</h1>
            </div>
            <span className="badge">Sample session</span>
          </div>
          <div className="layout">
            <section className="panel chart">
              <div className="panel-top">
                <div className="identity">
                  <div className="company-icon">{selected.symbol[0]}</div>
                  <div>
                    <h2>{selected.name}</h2>
                    <span>
                      {selected.symbol} · {selected.sector}
                    </span>
                  </div>
                </div>
                <button
                  className="save"
                  aria-pressed={saved.includes(selected.symbol)}
                  onClick={() => toggle(selected.symbol)}
                >
                  {saved.includes(selected.symbol) ? "Saved" : "Save company"}
                </button>
              </div>
              <div className="quote">
                <strong>${selected.price.toFixed(2)}</strong>
                <span className={selected.change < 0 ? "down" : "up"}>
                  {pct(selected.change)}
                </span>
                <small>USD · Illustrative</small>
              </div>
              <div className="periods">
                {[
                  [20, "1D"],
                  [35, "1W"],
                  [60, "1M"],
                ].map(([n, label]) => (
                  <button
                    key={n}
                    aria-pressed={period === n}
                    onClick={() => range(Number(n))}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Chart stock={selected} count={period} />
              <div className="axis">
                <span>Earlier observations</span>
                <span>Sample close</span>
              </div>
              <div className="stats">
                <div>
                  <span>Market cap</span>
                  <b>${selected.cap}</b>
                </div>
                <div>
                  <span>Sector</span>
                  <b>{selected.sector}</b>
                </div>
                <div>
                  <span>Data type</span>
                  <b>Fictional</b>
                </div>
              </div>
            </section>
            <aside className="panel">
              <div className="section-title">
                <h2>Sector snapshot</h2>
                <span>Sample</span>
              </div>
              <div className="heatmap">
                {stocks.map((s) => (
                  <button
                    key={s.symbol}
                    className={s.change < 0 ? "negative" : "positive"}
                    onClick={() => select(s)}
                  >
                    <b>{s.symbol}</b>
                    <span>{pct(s.change)}</span>
                  </button>
                ))}
              </div>
              <p className="caption">
                Equal-size tiles · Illustrative daily changes
              </p>
            </aside>
          </div>
          <div className="layout bottom">
            <section className="panel">
              <div className="section-title">
                <h2>{watchlist ? "Saved companies" : "Explore companies"}</h2>
                <label className="search">
                  <span className="sr-only">Search sample companies</span>
                  <input
                    type="search"
                    placeholder="Search symbol or company"
                    value={query}
                    onChange={(e) => search(e.target.value)}
                  />
                </label>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Price</th>
                      <th>Change</th>
                      <th>Favourite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.symbol}>
                        <td>
                          <button
                            className="stock-link"
                            onClick={() => select(s)}
                          >
                            <b>{s.symbol}</b>
                            <span>{s.name}</span>
                          </button>
                        </td>
                        <td>${s.price.toFixed(2)}</td>
                        <td className={s.change < 0 ? "down" : "up"}>
                          {pct(s.change)}
                        </td>
                        <td>
                          <button
                            className="star"
                            aria-label={`Save ${s.name}`}
                            aria-pressed={saved.includes(s.symbol)}
                            onClick={() => toggle(s.symbol)}
                          >
                            {saved.includes(s.symbol) ? "★" : "☆"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!filtered.length && (
                <p className="empty">
                  {query
                    ? "No matching sample companies."
                    : "Save a company to build your local watchlist."}
                </p>
              )}
            </section>
            <aside className="panel stories">
              <div className="section-title">
                <h2>Market brief</h2>
                <span>Fictional</span>
              </div>
              {headlines.map((h) => (
                <article key={h.title}>
                  <p>
                    {h.category}
                    <time>{h.time}</time>
                  </p>
                  <h3>{h.title}</h3>
                </article>
              ))}
            </aside>
          </div>
        </main>
        <footer>
          Agora Showcase{" "}
          <span>All companies, headlines and prices are fictional.</span>
        </footer>
      </div>
    </>
  );
}
