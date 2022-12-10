const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick user")
    .setDescriptionLocalizations({
      ru: "Кикнуть пользователя",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("target")
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
        .setName("reason")
        .setNameLocalizations({
          ru: "причина",
        })
        .setDescription("Type value")
        .setDescriptionLocalizations({
          ru: "Укажите причину кика",
        })
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const user = options.getUser("target");
    const reason = options.getString("reason");
    const id = user.id;
    const member = await interaction.guild.members.fetch(user.id);
    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return await interaction.reply({
        content: `Вы не можете кикнуть пользователя ${user.username}, так как его роль выше вашей! `,
      });
    }
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
      `DELETE from users where id = '${id}'`,
      async (err, row) => {
        con.end();

        await member
          .send(
            `Вы были кикнуты из семьи FATED.\n Вы можете снова подать заявку https://discord.gg/fated`
          )
          .catch((error) => {
            console.log("cant send message");
          });
        await member.kick(reason);

        await interaction.editReply({
          content: `Пользователь ${user} успешном кикнут по причине: ${reason}`,
          ephemeral: true,
        });
        client.channels.cache
          .get(process.env.logger_channel_id)
          .send(
            `Админ ${interaction.user.username} кикнул пользователя ${user} по причине ${reason}`
          );
      }
    );
  },
};
