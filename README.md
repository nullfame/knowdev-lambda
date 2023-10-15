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

* v1.1.0 - `log` supports JSON
* v1.0.1 - Make handler async 🤦🏻‍♂️

## 🛣 Roadmap

### Wishlist 🌠

## 📜 License

All rights reserved. Safe for use around pets.
