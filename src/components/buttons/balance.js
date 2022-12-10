const { ActionRowBuilder } = require("discord.js");
const { createConnection } = require("mysql");
module.exports = {
  data: {
    name: "balance",
  },
  async execute(interaction, client) {
    const member = interaction.user;
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
    });
    await interaction.deferReply({
      fetchReply: true,
    });
    buttons = new ActionRowBuilder();
    await con.query(
      `Select point from users where id = '${member.id}'`,
      async (err, row) => {
        con.end();
        const points = row[0].point;

        await interaction.editReply({
          content: `Ваш баланс равен: ${points}`,
          ephemeral: true,
        });
      }
    );
  },
};
