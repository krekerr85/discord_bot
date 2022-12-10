const cron = require("node-cron");

require("dotenv").config();
const { createConnection } = require("mysql");

module.exports = (client) => {
  client.job = cron.schedule(
    "* 07 * * *",
    () => {
      const con = createConnection({
        database: process.env.database,
        user: process.env.user,
        password: process.env.password,
        host: process.env.host,
      });
      con.query(
        `UPDATE users set vac_days = vac_days - 1 where onVacation = 1`,
        (err, row) => {
          con.query(
            `UPDATE users set onVacation = 0  where vac_days = 0`,
            (err, row) => {}
          );
        }
      );

      con.query(
        `UPDATE users set point = point - 12.5 where today_hours * 60 + today_seconds / 60 < 150 and onVacation = 0`,
        (err, row) => {}
      );
      con.query(
        `UPDATE users set  total_time = total_time + today_hours + today_seconds / 3600, today_hours = 0, today_seconds = 0`,
        (err, row) => {
          console.log(err);
        }
      );
    },
    {
      scheduled: true,
      timezone: "Europe/Moscow",
    }
  )
}
