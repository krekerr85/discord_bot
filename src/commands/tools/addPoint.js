const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_points")
    .setDescription("Add points to user")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Добавить очки пользователю",
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
    const { options } = interaction;
    user = options.getUser("user");
    username = user.username;
    id = user.id;
    point_add = options.getNumber("total_points");
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
      `UPDATE users set point = point + ${point_add} where id = '${id}'`,
      async (err, row) => {
        con.end();

        await interaction.editReply({
          content: `Успешно добавлено ${point_add} очков пользователю: ${username}`,
          ephemeral: true,
        });
        client.channels.cache
          .get(process.env.logger_channel_id)
          .send(
            `Админ ${interaction.user.username} добавил ${point_add} очков пользователю: ${username}`
          );
      }
    );
  },
};
