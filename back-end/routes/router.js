const routes = require("../controllers/routes.controller");
const oauth = require("../middleware/oauth");

module.exports = (router) => {
  //Login
  router.post("/ccmslogin", (req, res) => {
    oauth.login(req, res);
  });

  //Refresh token
  router.post("/refreshToken", (req, res) => {
    oauth.refresh(req, res);
  });

  //CRUD
  MapSpRouter("/sqlget", "spGetCentral");
  MapSpRouter("/sqlupdate", "spUpdateCentral");
  MapSpRouter("/sqlinsert", "spInsertCentral");
  MapSpRouter("/sqldelete", "spDeleteCentral");

  //FINANCIALS
  MapSpRouter("/getDetailRevenue", "SpDetalleIngresosFROM");
  MapSpRouter("/getDetailCost", "SpDetalleCostosFROM");
  MapSpRouter("/getUserCampaign", "SpUsserCampaignFROM");
  MapSpRouter("/getSummaryEuro", "SpResumenEurosFROM");
  MapSpRouter("/getSummary", "SpResumenFROM");
  MapSpRouter("/getDetailHistoric", "SpDetailHistoricFROM");
  MapSpRouter("/getCgp", "SpCGPFROM2");
  MapSpRouter("/getActualCgp", "SpActualCGPFROM2");



  function MapSpRouter(route, spName) {
    router.post(route, oauth.oauthOther, (req, res) =>
      routes.CallSp(spName, req, res)
    );
  }
};
