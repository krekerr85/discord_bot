const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("alter_coef")
    .setDescription("Alter coefficients")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Изменить коэффициент",
    })
    .addStringOption((option) =>
      option
        .setName("type")
        .setNameLocalizations({
          ru: "тип",
        })
        .setDescription("Coefficient type")
        .setRequired(true)
        .addChoices(
          { name: "Дневной", value: "day" },
          { name: "Ночной", value: "night" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("value")
        .setNameLocalizations({
          ru: "значение",
        })
        .setDescription("Type value")
        .setDescriptionLocalizations({
          ru: "Укажите новое значение коэффициента",
        })
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    coef_type = options.getString("type");
    value = options.getNumber("value");

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
      `UPDATE coefficients set coef = '${value}' where name = '${coef_type}'`,
      async (err, row) => {
        con.end();

        if (coef_type == "night") {
          coef_rus = "Ночной";
        } else {
          coef_rus = "Дневной";
        }
        await interaction.editReply({
          content: `${coef_rus} коэффициент успешно изменен на значение: ${value}`,
          ephemeral: true,
        });
        client.channels.cache
          .get(process.env.logger_channel_id)
          .send(
            `Админ ${interaction.user.username} изменил ${coef_rus} коэффициент на значение: ${value}`
          );
      }
    );
  },
};
