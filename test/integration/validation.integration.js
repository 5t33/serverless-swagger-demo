const supertest = require('supertest');
const OpenApiValidator = require('express-openapi-validator');
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname,'../../swagger.yml'),
    validateRequests: true, // (default)
  }),
);

app.use((req,res) => res.send(200))

const request = async ({path = "", httpMethod = "get", body = undefined, queryParams = {}}) => {
  if(httpMethod !== "get" && httpMethod !== "post" && httpMethod !== "put" && httpMethod !== "delete") {
    throw new Error("httpMethod must be one of \"get\", \"post\", \"put\", \"delete\"")
  }

  let resp = {};

  Object.keys(queryParams).forEach((key, indx) => {
    if(indx === 0) {
      path += `?${key}=${queryParams[key]}`
    } else {
      path += `&${key}=${queryParams[key]}`
    }
  })

  if(process.env.stage == "dev_local") {
    let req = supertest(app)[httpMethod](path)

    if(body) {
      req = req.send(body)
    }
    res = await req;
  } else {
    let axiosRes;
    try{
      axiosRes = await axios({
        method: httpMethod,
        url: `${process.env.base_url}${path}`,
        data: body || {}
      });
    }catch(err) {
      axiosRes = err.response;
    }
    res = {
      status: axiosRes.status,
      body: axiosRes.data
    }
  }
  return res;
}

describe("validation tests", () => {
  it("should return 400 without a query parameter", async (done) => {
    const res = await request({
      path: "/testFunc",
    })   
    expect(res.status).toEqual(400);
    done();
  });

  it("should return 200 when query parameter is included and correct type", async (done) => {
    const res = await request({
      path: "/testFunc",
      queryParams: {
        testQuery: "abc"
      }
    });
    expect(res.status).toEqual(200);
    done();
  });
});