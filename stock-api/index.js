const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(bodyParser.json());
app.use(cors());
/**
 * API for getStock, and delete stock
 * @author Amol Kumbhar
 */

/** Read Default Stock List */
function readDefaultStocksData() {
  const data = fs.readFileSync("default-stock-list.json");
  return JSON.parse(data);
}

/** Read Stock List */
function readStocksData() {
  const data = fs.readFileSync("stock-list.json");
  return JSON.parse(data);
}

/** Write Stock Data */
function writeStocksData(stocks) {
  fs.writeFileSync("stock-list.json", JSON.stringify(stocks));
}

/** Get Stock based on the tag */
app.post("/api/getStocks", (req, res) => {
  const tag = req.body.tag.toLowerCase();
  const stocks = readStocksData();
  if (tag === "all") {
    res.json(stocks);
  } else {
    const filteredStocks = stocks.filter(
      (stock) => stock.tag.toLowerCase() === tag
    );
    res.json(filteredStocks);
  }
});

/** Delete Stock based on the tag */
app.delete("/api/deleteStock/:stock", (req, res) => {
  const stocks = readStocksData();
  const stockSymbol = req.params.stock;
  const index = stocks.findIndex(
    (stockData) => stockData.symbol.toLowerCase() === stockSymbol.toLowerCase()
  );
  if (index !== -1) {
    stocks.splice(index, 1);
    writeStocksData(stocks);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "Stock not found" });
  }
});

/** Add default stock list */
app.get("/api/addDefaultStocksList", (req, res) => {
  const defaultStock = readDefaultStocksData();
  writeStocksData(defaultStock);
  res.json(defaultStock);
});

/** Get Unique */
app.get('/api/UniqueTags', (req, res) => {
  const stocks = readStocksData();
  const uniqueTags = new Set(stocks.map(stock => stock.tag.charAt(0).toUpperCase() + stock.tag.slice(1)));
  const tagsArray = ['All', ...Array.from(uniqueTags)];
  res.json(tagsArray);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
