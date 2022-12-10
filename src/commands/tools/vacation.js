const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("vac")
    .setDescription("Send to vacation")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Отправить в отпуск",
    })
    .addUserOption((option) =>
      option
        .setName("user")
        .setNameLocalizations({
          ru: "пользователь",
        })
        .setDescription("Select user")
        .setDescriptionLocalizations({
          ru: "Выберите пользователя",
        })
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("total_days")
        .setNameLocalizations({
          ru: "кол-во",
        })
        .setDescription("Number of days")
        .setDescriptionLocalizations({
          ru: "Укажите количество дней отпуска",
        })
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const user = options.getUser("user");
    const username = user.username;
    const id = user.id;
    const vac_days = options.getNumber("total_days");
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
      `UPDATE users set onVacation = 1, vac_days = '${vac_days}' where id = '${id}'`,
      async (err, row) => {
        console.log(row);
        con.end();

        await interaction.editReply({
          content: `Пользователь ${username} успешно отправлен в отпуск на ${vac_days} дней!`,
        });
        client.channels.cache
          .get(process.env.logger_channel_id)
          .send(
            `Админ ${interaction.user.username} отправил пользователя ${username} в отпуск на ${vac_days} дней!`
          );
      }
    );
  },
};
