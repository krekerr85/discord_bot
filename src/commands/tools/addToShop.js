const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_to_shop")
    .setDescription("Add item to shop")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Добавить предмет в магазин",
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
        .setName("description")
        .setNameLocalizations({
          ru: "описание",
        })
        .setDescription("Set description")
        .setDescriptionLocalizations({
          ru: "Укажите описание товара",
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
    description = options.getString("description");
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
      `INSERT INTO shop (name,description,cost,count) values ('${itemName}', '${description}', '${cost}', '${count}')`,
      async (err, row) => {
        con.end();

        await interaction.editReply({
          content: `Товар ${itemName} успешно добавлен в магазин`,
          ephemeral: true,
        });
        client.channels.cache
          .get(process.env.logger_channel_id)
          .send(
            `Админ ${interaction.user.username} добавил товар ${itemName} в магазин`
          );
      }
    );
  },
};
