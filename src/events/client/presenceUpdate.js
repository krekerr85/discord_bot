const { createConnection } = require("mysql");

module.exports = {
  name: "presenceUpdate",
  once: false,
  async execute(before, after) {
    playing = null;
    game = null;
    if (after.activities.length > 0) {
      if (after.activities[0].name == "RAGE Multiplayer" && after.activities[0].details == 'Проводит время' && after.activities[0].state == 'на gta5rp.com Rockford') {
        playing = true;
        game = after.activities[0].name;
      }
    } else {
      playing = false;
      game = null;
    }

    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
    });

    await con.query(
      `UPDATE users set playing = ${playing}, game = '${game}' where id = '${after.userId}'`,
      (err, row) => {}
    );
    con.end();
  },
};
