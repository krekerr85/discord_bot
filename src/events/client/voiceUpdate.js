const { createConnection } = require("mysql");

module.exports = {
  name: "voiceStateUpdate",
  once: false,
  async execute(before, after) {
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
    });
    await con.query(
      `UPDATE users set channel_id = '${after.channelId}' where id = '${after.id}'`,
      async (err, row) => {
      }
    );
    con.end();
  },
};
