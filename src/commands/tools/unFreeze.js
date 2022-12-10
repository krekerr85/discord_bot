const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("un_freeze")
    .setDescription("Freeze points events")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
    });
    client.job.start();
    client.job1.start();
    await interaction.editReply({
      content: "Выдача и снятие баллов возобновлена!",
      ephemeral: true,
    });
    client.channels.cache
      .get(process.env.logger_channel_id)
      .send(
        `Админ ${interaction.user.username} включил выдачу и снятие баллов`
      );
  },
};
