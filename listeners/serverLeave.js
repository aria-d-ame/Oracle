const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Server Goodbye',
  event: 'guildMemberRemove',

  run: async (ctx) => {
    if (ctx.user.bot) return;

    console.log(`${ctx.user.username} has left the server.`); // Debug log

    try {
      const goodbyeChannel = await ctx.guild.channels.fetch('1329847303888048138');
      const logChannel = await ctx.guild.channels.fetch('1278877530635374675');

      const leaveEmbed = new EmbedBuilder()
        .setTitle(`🔸${ctx.user.username} has closed the ${ctx.guild.name}.`)
        .setColor(`orange`)
				.setAuthor({
					name: ' ',
					iconURL: ctx.user.displayAvatarURL() || ' '
				})
        .setTimestamp()
        .setFooter({
          text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
          iconURL: ctx.guild.iconURL()
        });

      await goodbyeChannel.send({ embeds: [leaveEmbed] });

    } catch (error) {
      console.error('Error sending goodbye message:', error);
    }
  }
});