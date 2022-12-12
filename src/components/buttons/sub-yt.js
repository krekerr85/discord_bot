const { createConnection } = require("mysql");
require("dotenv").config();
module.exports = {
  data: {
    name: "sub-yt",
  },
  async execute(interaction, client, customId) {
    const { user } = interaction;
    const con = createConnection({
      database: process.env.database,
      user: process.env.user,
      password: process.env.password,
      host: process.env.host,
      multipleStatements: true,
    });
    await interaction.deferReply({
      fetchReply: true,
    });
    await con.query(
      `Select * from users where id = ${user.id}`,
      async (err, row) => {
        if (row.length > 0) {
          const { point } = row[0];
          await con.query(
            `Select * from shop where name = '${customId}'`,
            async (err, row) => {
              if (err == null) {
                itemName = row[0].name;
                itemCost = row[0].cost;
                if (point < itemCost) {
                  await interaction.editReply({
                    content: "Не достаточно средств",
                    ephemeral: true,
                  });
                } else {
                  await con.query(
                    `UPDATE users set point = point - ${itemCost} where id = '${user.id}';
                UPDATE shop set count = CASE WHEN count is null then null ELSE count - 1 end where name = '${itemName}';`,
                    async (err, row) => {
                      con.end();
                      if (err == null) {
                        client.channels.cache
                          .get(process.env.logger_channel_id)
                          .send(
                            `Пользователь ${user.username} совершил покупку ${itemName}`
                          );
                        client.users.cache
                          .get(process.env.admin_id)
                          .send(
                            `Пользователь ${user.username} совершил покупку ${itemName}`
                          );
                        await interaction.editReply({
                          content: "Покупка совершена",
                          ephemeral: true,
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        }else{
          await interaction.editReply({
            content: "Вас нет в базе!",
            ephemeral: true,
          });
        }
      }
    );
  },
};
