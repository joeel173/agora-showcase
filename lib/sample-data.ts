/** Fictional companies and deterministic prices, solely for interface demonstration. */
export type Stock = {symbol: string; name: string; sector: string; price: number; change: number; cap: string; history: number[]};
const series = (base: number, trend: number, phase: number) => Array.from({length: 60}, (_, i) => Number((base + i * trend + Math.sin(i * .55 + phase) * 2.8 + Math.cos(i * 1.7) * .8).toFixed(2)));
export const stocks: Stock[] = [
  {symbol:"ARC",name:"Arcadia Systems",sector:"Technology",price:184.62,change:2.34,cap:"842B",history:series(169, .26, 1)},
  {symbol:"LMN",name:"Lumen Industries",sector:"Industrials",price:92.18,change:-1.28,cap:"126B",history:series(100, -.13, 2)},
  {symbol:"NVX",name:"Novex Semiconductor",sector:"Technology",price:167.45,change:3.12,cap:"615B",history:series(147, .34, 3)},
  {symbol:"VRA",name:"Vera Health",sector:"Healthcare",price:128.74,change:.86,cap:"218B",history:series(121, .12, 4)},
  {symbol:"OAK",name:"Oakridge Finance",sector:"Financials",price:64.32,change:-.74,cap:"97B",history:series(68, -.07, 5)},
  {symbol:"SOL",name:"Solace Energy",sector:"Energy",price:78.91,change:1.46,cap:"144B",history:series(70, .15, 6)},
];
export const headlines = [
  {category:"Technology",title:"Chipmakers lead a broad recovery in the sample market",time:"09:45"},
  {category:"Markets",title:"Investors watch fictional earnings as the session opens",time:"09:20"},
  {category:"Energy",title:"Energy shares advance in the illustrative sector overview",time:"08:55"},
];

for (const stock of stocks) {
 const shift = stock.price - stock.history[stock.history.length - 1];
 stock.history = stock.history.map(value => Number((value + shift).toFixed(2)));
}
