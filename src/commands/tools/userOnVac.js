const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config();
const { createConnection } = require("mysql");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("users_on_vac")
    .setDescription("All users who is currently on vacation")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Все пользователи находящиеся в отпуске",
    }),

  async execute(interaction, client) {
    arrayString = "";
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
    });
    await interaction.deferReply({
      fetchReply: true,
    });
    await con.query(
      `Select * from users where onVacation = 1`,
      async (err, row) => {
        con.end();
          row.forEach((element) => {
            if (arrayString == "") {
              arrayString = "Пользователи находящиеся в отпуске: \n";
            }
            arrayString += `${element.name} \n`;
          });
          if (arrayString == "") {
            arrayString = "Нет пользователей находящийся в отпуске!";
          }
          await interaction.editReply({
            content: arrayString,
          });
        }
      
    );
  },
};
