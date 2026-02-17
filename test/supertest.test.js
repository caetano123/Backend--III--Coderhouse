import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

const request = supertest(app);

describe("Tests funcionales - Users, Pets y Adoptions", function () {
  this.timeout(15000); // Timeout amplio

  let userId;
  let petId;
  let adoptionId;

  /* =========================
     BEFORE: Conectar DB y limpiar colecciones
  ========================== */
  before(async function () {
    await mongoose.connect("mongodb://localhost:27017/adoptions_test");

    await mongoose.connection.db.collection("users").deleteMany({});
    await mongoose.connection.db.collection("pets").deleteMany({});
    await mongoose.connection.db.collection("adoptions").deleteMany({});
  });

  /* =========================
     AFTER: Limpiar DB y cerrar conexión
  ========================== */
  after(async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  /* =========================
     TEST GET ADOPTIONS (vacío)
  ========================== */
  it("GET /api/adoptions → debe devolver un array vacío", async function () {
    const res = await request.get("/api/adoptions");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.be.an("array").that.is.empty;
  });

  /* =========================
     SETUP USER & PET
  ========================== */
  it("Setup → crear usuario y mascota", async function () {
    // Crear usuario
    const userRes = await request.post("/api/sessions/register").send({
      first_name: "Test",
      last_name: "User",
      email: "testuser@test.com",
      password: "1234",
    });

    expect(userRes.status).to.equal(201);
    userId = userRes.body.payload?._id;
    expect(userId).to.exist;

    // Crear mascota
    const petRes = await request.post("/api/pets").send({
      name: "Firulais",
      specie: "dog",
      birthDate: "2020-01-01",
    });

    expect(petRes.status).to.equal(201);
    petId = petRes.body.payload?._id;
    expect(petId).to.exist;
  });

  /* =========================
     SUCCESS: ADOPCIÓN
  ========================== */
  it("POST /api/adoptions/:uid/:pid → adopción exitosa", async function () {
    const res = await request.post(`/api/adoptions/${userId}/${petId}`);

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("success");
    expect(res.body).to.have.property("payload");
    expect(res.body.payload.owner).to.equal(userId);
    expect(res.body.payload.pet).to.equal(petId);

    adoptionId = res.body.payload._id;
    expect(adoptionId).to.exist;
  });

  /* =========================
     GET ADOPTION BY ID (SUCCESS)
  ========================== */
  it("GET /api/adoptions/:aid → debe devolver la adopción", async function () {
    const res = await request.get(`/api/adoptions/${adoptionId}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.have.property("_id", adoptionId);
  });

  /* =========================
     GET ADOPTION BY ID (ERROR)
  ========================== */
  it("GET /api/adoptions/:aid → error adopción inexistente", async function () {
    const fakeAdoptionId = "000000000000000000000000";

    const res = await request.get(`/api/adoptions/${fakeAdoptionId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });

  /* =========================
     ERROR: PET YA ADOPTADA
  ========================== */
  it("POST /api/adoptions/:uid/:pid → error mascota ya adoptada", async function () {
    const res = await request.post(`/api/adoptions/${userId}/${petId}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error").that.includes("already adopted");
  });

  /* =========================
     ERROR: USUARIO NO EXISTE
  ========================== */
  it("POST /api/adoptions/:uid/:pid → error usuario inexistente", async function () {
    const invalidUserId = "000000000000000000000000";
    const res = await request.post(`/api/adoptions/${invalidUserId}/${petId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error").that.includes("User not found");
  });

  /* =========================
     TEST GET USERS
  ========================== */
  it("GET /api/users → debe devolver usuarios", async function () {
    const res = await request.get("/api/users");

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array").that.is.not.empty;
  });

  /* =========================
     TEST GET PETS
  ========================== */
  it("GET /api/pets → debe devolver mascotas", async function () {
    const res = await request.get("/api/pets");

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array").that.is.not.empty;
  });
});
