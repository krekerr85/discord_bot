const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("subtract_points")
    .setDescription("Substract points")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Отнять очки у пользователя",
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
        .setName("total_points")
        .setNameLocalizations({
          ru: "кол-во",
        })
        .setDescription("Type value")
        .setDescriptionLocalizations({
          ru: "Укажите сколько очков хотите добавить пользователю",
        })
        .setRequired(true)
    ),
  async execute(interaction, client) {
    username = interaction.options._hoistedOptions[0].user.username;
    id = interaction.options._hoistedOptions[0].user.id;
    point_add = interaction.options._hoistedOptions[1].value;
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
    });
    await interaction.deferReply({
      fetchReply: true,
    });
    con.query(
      `UPDATE users set point = point - ${point_add} where id = ${id}`,
      async (err, row) => {
        con.end();
        await interaction.editReply({
          content: `Успешно отнятно ${point_add} очков у пользователя: ${username}`,
          ephemeral: true,
        });

        client.channels.cache
          .get(process.env.logger_channel_id)
          .send(
            `Админ ${interaction.user.username} отнял ${point_add} очков у пользователя: ${username}`
          );
      }
    );
  },
};
