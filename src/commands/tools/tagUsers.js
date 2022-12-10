const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { createConnection } = require("mysql");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tag_users")
    .setDescription("Tag users")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Отметить пользователей",
    })
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to echo into")
        .setDescriptionLocalizations({
          ru: "Выберите канал",
        })
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const channel = options.getChannel("channel");
    const channelId = channel.id;
    let arrayString = "";
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
      `Select * from users where playing = 1 and channel_id != '${channelId}'`,
      async (err, row) => {
        con.end();
        console.log(err)
        row.forEach((element) => {
          if (arrayString == "") {
            arrayString = `Пользователи которые находятся в игре, но не находятся в канале ${channel}: \n`;
          }
          arrayString += `<@${element.id}> \n`;
        });
        if (arrayString == "") {
          await interaction.editReply({
            content: "Таких пользователей нет!",
            ephemeral: true,
          });
        } else {
          await interaction.editReply({
            content: arrayString,
          });
        }
      }
    );
  },
};
