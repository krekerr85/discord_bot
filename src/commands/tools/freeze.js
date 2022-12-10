const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("freeze")
    .setDescription("Freeze points events")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction, client) {
    await interaction.deferReply({
      ephemeral:true,
    });
    client.job.stop();
    client.job1.stop();
    await interaction.editReply({
      content: "Выдача и снятие баллов остановлена!",
      ephemeral: true,
    });
    client.channels.cache
      .get(process.env.logger_channel_id)
      .send(
        `Админ ${interaction.user.username} отключил выдачу и снятие баллов`
      );
  },
};
