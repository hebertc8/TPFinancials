const redirect = require("../controllers/redirect.controller");
require("dotenv").config();

async function configure(call) {
  let body = {
    key: process.env.IDKEY,
    project: process.env.PROJECT,
    ip: "",
    uri: "/api/configserver",
    size: 0,
  };
  await redirect
    .post("http://10.151.230.137:47007", "/api/configserver", body, null)
    .then((data) => {
      process.env.SECRET = data.data.secret;
      process.env.ALGORITHM = data.data.algo;
      process.env.KEY = data.data.key;
      process.env.IV = data.data.iv;
      call("terminado");
    })
    .catch((error) => console.log(error));
}

module.exports = { configure };
