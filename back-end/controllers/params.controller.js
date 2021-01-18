const TYPES = require("tedious").TYPES;
const moment = require("moment");

let parametrizacion = (data) => {
  console.log(data)
  try {
    let obj = {
      table: [],
    };
    data.forEach((dato) => {
      let nombre = dato.item;
      let valor = dato.datos.valor;
      let tipo = dato.datos.tipo;
      console.log(nombre, valor, tipo)
      if (tipo == "varchar") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.VarChar });
      } else if (tipo == "int") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.Int });
      } else if (tipo == "bit") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.Bit });
      } else if (tipo == "date") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.Date });
      } else if (tipo == "time") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.Time });
      } else if (tipo == "char") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.Char });
      } else if (tipo == "bigint") {
        obj.table.push({ nombre: nombre, valor: valor, tipo: TYPES.BigInt });
      }
    });
    return obj.table;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.parametros = (req, tipo) => {
  switch (tipo) {
    case "spInsertCentral":
      return parametrizacion([
        { item: "central", datos: { valor: req.central, tipo: "varchar" } },
        { item: "mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "pais", datos: { valor: req.pais, tipo: "varchar" } },
      ]);
    case "spUpdateCentral":
      return parametrizacion([
        { item: "id", datos: { valor: req.id, tipo: "int" } },
        { item: "central", datos: { valor: req.central, tipo: "varchar" } },
        { item: "mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "pais", datos: { valor: req.pais, tipo: "varchar" } },
      ]);
    case "spDeleteCentral":
      return parametrizacion([
        { item: "id", datos: { valor: req.id, tipo: "int" } },
      ]);
    case "SpDetalleIngresosFROM":
      return parametrizacion([
        { item: "Mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "Cliente", datos: { valor: req.cliente, tipo: "varchar" } },
        { item: "Campaign", datos: { valor: req.campaign, tipo: "varchar" } },
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
      ]);
    case "SpDetalleCostosFROM":
      return parametrizacion([
        { item: "Mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "Cliente", datos: { valor: req.cliente, tipo: "varchar" } },
        { item: "Campaign", datos: { valor: req.campaign, tipo: "varchar" } },
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
      ]);
    case "SpUsserCampaignFROM":
      return parametrizacion([
        { item: "usser", datos: { valor: req.user, tipo: "varchar" } },
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
      ]);
    case "SpResumenEurosFROM":
      return parametrizacion([
        { item: "Anio", datos: { valor: req.year, tipo: "int" } },
        { item: "Mes", datos: { valor: req.mes, tipo: "varchar" } },
        { item: "Country", datos: { valor: req.country, tipo: "varchar" } },
        { item: "Mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "Cliente", datos: { valor: req.cliente, tipo: "varchar" } },
        { item: "Campaign", datos: { valor: req.campaign, tipo: "varchar" } },
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
      ]);
    case "SpResumenFROM":
      return parametrizacion([
        { item: "Anio", datos: { valor: req.year, tipo: "int" } },
        { item: "Mes", datos: { valor: req.mes, tipo: "varchar" } },
        { item: "Country", datos: { valor: req.country, tipo: "varchar" } },
        { item: "Mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "Cliente", datos: { valor: req.cliente, tipo: "varchar" } },
        { item: "Campaign", datos: { valor: req.campaign, tipo: "varchar" } },
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
      ]);
    case "SpDetailHistoricFROM":
      return parametrizacion([
        { item: "Anio", datos: { valor: req.year, tipo: "int" } },
        { item: "Mes", datos: { valor: req.mes, tipo: "varchar" } },
        { item: "Country", datos: { valor: req.country, tipo: "varchar" } },
        { item: "Mercado", datos: { valor: req.mercado, tipo: "varchar" } },
        { item: "Cliente", datos: { valor: req.cliente, tipo: "varchar" } },
        { item: "Campaign", datos: { valor: req.campaign, tipo: "varchar" } },
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } }
      ]);
    case "SpCGPFROM2":
      return parametrizacion([
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
        { item: "Region", datos: { valor: req.region, tipo: "varchar" } },
        { item: "Country", datos: { valor: req.country, tipo: "varchar" } },
        { item: "Sub", datos: { valor: req.sub, tipo: "varchar" } }
      ]);
    case "SpActualCGPFROM2":
      return parametrizacion([
        { item: "CaseType", datos: { valor: req.caseType, tipo: "int" } },
        { item: "Region", datos: { valor: req.region, tipo: "varchar" } },
        { item: "Country", datos: { valor: req.country, tipo: "varchar" } },
        { item: "Sub", datos: { valor: req.sub, tipo: "varchar" } },
        { item: "yearini", datos: { valor: req.yearIni, tipo: "int" } },
        { item: "yearfin", datos: { valor: req.yearFin, tipo: "int" } },
        { item: "monthini", datos: { valor: req.monthIni, tipo: "int" } },
        { item: "monthfin", datos: { valor: req.monthFin, tipo: "int" } }
      ]);
    default:
      break;
  }
  var size = Object.keys(req.body).length;
  if (size == 0) {
    return [];
  }
};
