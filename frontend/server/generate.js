var faker = require("faker");

var database = { products: [] };

for (var i = 1; i <= 300; i++) {
  database.products.push({
    id: i,
    title: faker.class.title(),
    description: faker.class.description(),
    relatedTopicIds: faker.class.relatedTopicIds(),
  });
}

console.log(JSON.stringify(database));
