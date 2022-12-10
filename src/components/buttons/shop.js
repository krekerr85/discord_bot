const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createConnection } = require("mysql");
module.exports = {
  data: {
    name: "shop",
  },
  async execute(interaction, client) {
    let arrayString = "**Добро пожаловать в магазин**!\n";
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
    await con.query(`Select * from shop`, async (err, row) => {
      con.end();

      row.forEach((element, i) => {
        arrayString += `\`${i + 1}\` **${element.name}** | ${
          element.cost
        } \n\n`;
        const button = new ButtonBuilder()
          .setCustomId(element.name)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Primary);
        buttons.addComponents(button);
      });
      arrayString += `\` \` *Нажмите на кнопку ниже чтобы продолжить*...`;

      await interaction.editReply({
        content: arrayString,
        components: [buttons],
        ephemeral: true,
      });
    });
  },
};
