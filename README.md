# KnowDev Lambda 🚟

AWS Lambda toolkit

## 📋 Usage

### Installation

``` bash
npm install --save @knowdev/lambda
```

### Example

``` javascript
const { log, projectHandler } = require("@knowdev/lambda");

exports.handler = projectHandler(async (event, context) => {
  log.info("Hello, world!");
  return { message: "Hello, world!" };
});
```

## 📖 Reference

## 📝 Changelog

## 🛣 Roadmap

### Wishlist 🌠

## 📜 License

All rights reserved. Safe for use around pets.
