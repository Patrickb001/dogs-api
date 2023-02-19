const request = require("supertest");
// express app
const { app } = require("./index");

// db setup
const { sequelize, Dog } = require("./db");
const seed = require("./db/seedFn");
const { dogs } = require("./db/seedData");

describe("Endpoints", () => {
  // to be used in POST test
  const testDogData = {
    breed: "Poodle",
    name: "Sasha",
    color: "black",
    description:
      "Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
  };

  beforeAll(async () => {
    // rebuild db before the test suite runs
    await seed();
  });

  describe("GET /dogs", () => {
    it("should return list of dogs with correct data", async () => {
      // make a request
      const response = await request(app).get("/dogs");
      // assert a response code
      expect(response.status).toBe(200);
      // expect a response
      expect(response.body).toBeDefined();
      // toEqual checks deep equality in objects
      expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
    });
  });

  describe("POST /dogs", () => {
    it("should return a new dog that has been created", async () => {
      const response = await request(app).post("/dogs").send(testDogData);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body["name"]).toEqual(testDogData.name);
      expect(response.body["description"]).toEqual(testDogData.description);
      expect(response.body["breed"]).toEqual(testDogData.breed);
    });
  });

  describe("DELETE /dogs/:id", () => {
    it("should delete a dog when an id is passed in the parameter, and id is found", async () => {
      const id = 1;
      const response = await request(app).delete(`/dogs/${id}`);

      const [deltedDog] = await Dog.findAll({ where: { id } });

      expect(response.status).toBe(200);
      expect(response.text).toEqual(`deleted dog with id ${id}`);
      expect(deltedDog).toBeUndefined();
    });
  });
});
