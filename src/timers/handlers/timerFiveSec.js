process.env.TZ = "Europe/Moscow";
const cron = require("node-cron");
require("dotenv").config();
const { createConnection } = require("mysql");

module.exports = (client) => {
  
  client.job1 = cron.schedule("*/5 * * * * *", () => {
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
      multipleStatements: true,
    });
    const d = new Date();
    let coef;
    if (d.getHours() >= 0 && d.getHours() <= 7) {
      coef = "night";
    } else {
      coef = "day";
    }
    con.query(`SELECT * FROM users where point < 0;`, async (err, row) => {
      row.forEach(async (element) => {
        member = client.guilds.cache.get('822945109854257154').members.cache.get(element.id);
        member.kick('ban');
      });

      con.query(
        `DELETE from users where point < 0;
          UPDATE users set today_seconds = today_seconds + 5 where playing = 1;
          UPDATE users set point = point + 5 * (select coef from coefficients where name = ${coef}), today_hours = today_hours + 1, today_seconds = today_seconds - 3600 where today_seconds >= 3600`,
        async (err, row) => {
          con.end();
        }
      );
    });
  })
};
