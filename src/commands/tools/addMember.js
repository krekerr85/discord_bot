const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_member")
    .setDescription("Adding new member")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescriptionLocalizations({
      ru: "Добавить нового пользователя",
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
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setNameLocalizations({
          ru: "ник",
        })
        .setDescription("Set nickname")
        .setDescriptionLocalizations({
          ru: "Укажите ник",
        })
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const nickname = options.getString("nickname");
    const user = options.getUser("user");
    const username = user.username;
    const member = interaction.options.getMember("user");
    const id = user.id;
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
    });
    await interaction.deferReply({
      fetchReply: true,
    });
    if (member != null && member.presence != null && member.presence.activities.length > 0) {
      const found = member.presence.activities.find(element => element.name == "RAGE Multiplayer" && element.state == "на gta5rp.com Rockford");
      if (found) {
        playing = true;
        game = member.presence.activities[0].name;
      }
    }else if(member == null) {
      return await interaction.editReply({
        content: `Пользователя ${username} нет на сервере! `,
      });
    } else {
      playing = false;
      game = null;
    }
    con.query(
      `INSERT users (id,name,nick,playing) values ('${id}', '${username}', '${nickname}', ${playing})`,
      async (err, row) => {
        if (err != null && err.code == "ER_DUP_ENTRY") {
          return await interaction.editReply({
            content: `Пользователь ${username} уже есть в базе! `,
          });
        } else {
          if (nickname != null) {
            await member.setNickname(nickname);
          }
          await interaction.editReply({
            content: `Пользователь ${username} успешно добавлен! `,
            ephemeral: true,
          });
          await client.channels.cache
            .get(process.env.logger_channel_id)
            .send(
              `Админ ${interaction.user.username} добавил пользователя ${username}`
            );
        }
      }
    );
  },
};
