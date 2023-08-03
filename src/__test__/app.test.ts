import request from "supertest";
import app from "../app";

describe("POST /userlogin", () => {
  test("should respond with 'kishan'", async () => {
    const respFromServer = await request("http://localhost:60275")
      .post("/auth/userlogin")
      .send({
        userName: "kishan",
        password: "kishan"
      });

    const msg = JSON.parse(respFromServer.text);

    expect(msg.message).toBe("kishan");
  });
});
