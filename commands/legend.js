let mysql = require("mysql");
const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");
const moment = require("moment");

let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

module.exports = {
  name: "legend",
  description: "Info about specific legends in-game.",
  execute(message, args) {
    var legendName = args[0];

    if (legendName == null)
      return message.channel.send(
        "Please provide a legend name to view their stats and info."
      );

    var fixName = legendName
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

    var legends = [
      // Current list of legends that have banner images
      "Bangalore",
      "Bloodhound",
      "Caustic",
      "Crypto",
      "Gibraltar",
      "Horizon",
      "Lifeline",
      "Loba",
      "Mirage",
      "Octane",
      "Pathfinder",
      "Rampart",
      "Revenant",
      "Wattson",
      "Wraith",
    ];

    if (legends.indexOf(fixName) == -1)
      return message.channel.send(
        "Seems that legend isn't in our database yet."
      );

    var name = mysql.escape(legendName);

    let sql = `SELECT * FROM ${config.SQL.legendTable} WHERE \`name\` = ${name}`;

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return message.channel.send(
          "There was a problem with our database. If this problem persists, please contact a mod."
        );
      }

      connection.query(sql, function (err, results, fields) {
        if (err) {
          connection.release();
          console.log(err);
          return message.channel.send(
            "There was a problem with our database. If this problem persists, please contact a mod."
          );
        }

        const info = new Discord.MessageEmbed()
          .setTitle(`${results[0].name}`)
          .setColor(results[0].hex)
          .setThumbnail(
            `https://sdcore.dev/cdn/ApexStats/LegendIcons/${
              results[0].name
            }.png?q=${moment().valueOf()}`
          )
          .setDescription(`${results[0].description}`)
          .addField("Age", results[0].age, true)
          .setImage(
            `https://sdcore.dev/cdn/ApexStats/LegendBanners/${
              results[0].name
            }.png?q=${moment().valueOf()}`
          )
          .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO);

        message.channel.send(info);
        connection.release();
      });
    });
  },
};
