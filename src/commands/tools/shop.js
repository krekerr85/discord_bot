const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("create_shop")
    .setDescription("Shop")
    .setDescriptionLocalizations({
      ru: "Магазин",
    }),
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
    });
    const channel = client.channels.cache.find(
      (channel) => channel.name === "shop"
    );
    const embed = new EmbedBuilder()
      .setTitle("Добро пожаловать в магазин")
      .setColor(0x18e1ee)
      .setTimestamp(Date.now());
    buttons = new ActionRowBuilder();
    const buttonShop = new ButtonBuilder()
      .setCustomId("shop")
      .setLabel("Магазин")
      .setStyle(ButtonStyle.Primary);
    const buttonBalance = new ButtonBuilder()
      .setCustomId("balance")
      .setLabel("Баланс")
      .setStyle(ButtonStyle.Primary);
    buttons.addComponents(buttonShop);
    buttons.addComponents(buttonBalance);
    await channel.send({ embeds: [embed], components: [buttons] });
    await interaction.editReply({ content: "Магазин создан!", ephemeral: true });
  },
};
