const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("change_cost")
    .setDescription("Change item cost")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Изменить цену",
    })
    .addStringOption((option) =>
      option
        .setName("name")
        .setNameLocalizations({
          ru: "название",
        })
        .setDescription("Set name")
        .setDescriptionLocalizations({
          ru: "Укажите название товара",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("cost")
        .setNameLocalizations({
          ru: "стоимость",
        })
        .setDescription("Set cost")
        .setDescriptionLocalizations({
          ru: "Укажите стоимость",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("count")
        .setNameLocalizations({
          ru: "количество",
        })
        .setDescription("Set count")
        .setDescriptionLocalizations({
          ru: "Укажите количество",
        })
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    itemName = options.getString("name");
    cost = options.getString("cost");
    count = options.getString("count");

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
      `UPDATE shop set cost = '${cost}' , count = CASE WHEN ${count} is not null then '${count}' else count end where name = '${itemName}'`,
      async (err, row) => {
        if (row.affectedRows == 0) {
          message = "Такого товара нет в магазине!";
        } else {
          con.end();
          message = `У товара ${itemName} успешно изменилась цена на ${cost}`;
          await interaction.editReply({
            content: message,
            ephemeral: true,
          });
          client.channels.cache
            .get(process.env.logger_channel_id)
            .send(
              `Админ ${interaction.user.username} изменил стоимость товара ${itemName} на ${cost}`
            );
        }
      }
    );
  },
};
