import request from "supertest";

describe("POST /userlogin", () => {
  test("should respond with 'kishan'", async () => {
    const respFromServer = await request("http://localhost:3000")
      .post("/auth/userlogin")
      .send({
        userName: "kishan",
        password: "kishan"
      });

    const msg = JSON.parse(respFromServer.text);

    expect(msg.message).toBe("kishan");
  });
});
