import { it, expect, describe, jest, beforeAll, afterAll } from "@jest/globals";

function waitForServerStatus(server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve());
  });
}

describe("E2E Test Suite", () => {
  describe("E2E for server in a non-test env", () => {
    it("should start server with port 4000", async () => {
      const PORT = 4000;
      process.env.NODE_ENV = "production";
      process.env.PORT = PORT;

      jest.spyOn(console, console.log.name);

      const { default: server } = await import("../src/index.js");
      await waitForServerStatus(server);

      const serverInfo = server.address();
      expect(serverInfo.port).toBe(4000);
      expect(console.log).toHaveBeenCalledWith(
        `server is running at ${serverInfo.address}:${serverInfo.port}`
      );
      server.close();
    });
  });

  describe("E2E Tests for Server", () => {
    let _testServer;
    let _testServerAddress;

    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();

      await waitForServerStatus(_testServer);

      const serverInfo = _testServer.address();
      _testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    afterAll((done) => _testServer.close(done));

    it("Should return 404 to unsupported routes", async () => {
      const response = await fetch(`${_testServerAddress}/unsupported`, {
        method: "POST",
      });

      expect(response.status).toBe(404);
    });

    it("Should return 400 and CPF missing field message when CPF is not provided", async () => {
      const invalidPerson = { name: "Fulano da Silva" }; // Missing cpf
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.validationError).toEqual("CPF is required.");
    });

    it("Should return 400 and Name missing field message when Name is not provided", async () => {
      const invalidPerson = { cpf: "123.123.123-12" }; // Missing name
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        body: JSON.stringify(invalidPerson),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.validationError).toEqual("Name is required.");
    });
  });
});
