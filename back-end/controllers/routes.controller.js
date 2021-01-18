const sql = require("./sql.controller");
const parametros = require("./params.controller").parametros;

exports.CallSp = (spName, req, res) => {
  if (isEmpty(req.body)) {
    
    sql
    .query(spName, null)
    .then((resultado) => {
      responsep(1, req, res, resultado);
    })
    .catch((err) => {
      {
        responsep(2, req, res, err);
      }
    });
  } else {
    sql
    .query(spName, parametros(req.body, spName))
    .then((result) => {
      responsep(1, req, res, result);
    })
    .catch((err) => {
      responsep(2, req, res, err);
    });
  }
};

function isEmpty(req){
  for(var key in req){
    if(req.hasOwnProperty(key))
      return false;
  }
  return true;
}

exports.test = (req, res) => {
  let num = Math.floor(Math.random() * (100 - 1)) + 1;
  let options = {
    //ms s    m     h   d
    maxAge: 1000 * 60 * 60 * 24 * 60, // would expire after 15 minutes
    httpOnly: true,
  };
  res.cookie("XSRF-TOKEN", req.csrfToken(), options);
  res.status(200).json({ random: num });
};

exports.test2 = (req, res) => {
  

  res.status(200).json({ RST: "Funcional" });
};

let responsep = (tipo, req, res, resultado, cookie) => {
  return new Promise((resolve, reject) => {
    if (tipo == 1) {
      res.cookie("XSRF-TOKEN", req.csrfToken(), {
        "max-Age": new Date(Date.now() + 90000000),
        path: "/",
      });
      res.status(200).json(resultado);
    } else if (tipo == 2) {
      console.log("Error at:", date, "res: ", resultado);
      res.status(400).json(resultado);
    }
  });
};
