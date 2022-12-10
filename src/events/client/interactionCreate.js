module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.user.bot) return;
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
        console.log(interaction);
      } catch (error) {
        console.log(interaction);
        console.log(error);
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      let button;
      if (customId == "shop") {
        button = buttons.get(customId);
      } else if (customId == "balance") {
        button = buttons.get(customId);
      } else {
        button = buttons.get("sub-yt");
      }

      if (!button) return new Error("Такой кнопки нет!");

      try {
        await button.execute(interaction, client, customId);
      } catch (error) {
        console.log(error);
      }
    }
  },
};
