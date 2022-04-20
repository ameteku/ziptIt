var faker = require("faker");

var database = { products: [] };

for (var i = 1; i <= 300; i++) {
  database.products.push({
    id: i,
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(),
    price: faker.commerce.price(),
    quantity: faker.random.number(),
  });
}

console.log(JSON.stringify(database));
