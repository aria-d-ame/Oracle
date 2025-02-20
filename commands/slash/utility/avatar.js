const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'avatar',
  description: 'Get a user\'s avatar',
  type: [CommandType.SLASH],

  run: async (ctx) => {
    try{
      const user = ctx.options.getUser(`user`) || ctx.user;
      const member = await ctx.guild.members.fetch(user.id);

      const icon = user.displayAvatarURL({ dynamic: true, size: 2048 });

      const avatarembed = new EmbedBuilder()
      .setColor(0xE67E22)
      .setTitle(`🔸USER AVATAR🔸`)
      .setAuthor({ name: user.displayName })
      .setImage(icon)
      .setFooter({
        text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
        iconURL: ctx.guild.iconURL() // Optional: Server icon URL
      })

      await ctx.reply({ embeds: [avatarembed] });
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.reply('⚠️ Error occurred while fetching user information.');
    }
  }
})