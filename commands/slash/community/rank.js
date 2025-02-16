const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const levelSchema = require('../../../schemas/level.js');
const xpRankPosition = require('../../../utils/xpRankPosition.js')

new Command({
  name: 'rank',
  description: 'Check someone\'s rank in the server!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'Member for rank check!',
      type: ArgumentType.USER,
      required: false
    }),
  ],

  run: async (ctx) => {
    const user = ctx.arguments.getUser(`user`) || ctx.user;
		const member = await ctx.guild.members.fetch(user.id);
    const { guild } = ctx
    const xpData = await levelSchema.findOne({ Guild: guild.id, User: member.id });
    const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });
    const xpRank = await xpRankPosition(user.id, ctx.guild.id);
      if (!xpData) return await ctx.interaction.reply({ content: 'This user does not have any data yet!', ephemeral: true });
      
      const Required = xpData.Level * xpData.Level * 30
  
      const rankEmbed = new EmbedBuilder()
      .setColor(`orange`)
      .setTitle(`🔸RANK🔸`)
      .setAuthor({ name: user.displayName })
      .setThumbnail(icon)
      .setFooter({
        text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
        iconURL: ctx.guild.iconURL()
      })
      .setDescription(' ')
      .addFields(
        { name: 'XP', value: ' ', inline: false },
        { name: '🔸Level:', value: `🔸${xpData.Level}`, inline: true },
        { name: '🔸Rank:', value: `🔸${xpRank}`, inline: true }, 
        { name: ' ', value: ' ', inline: false },
        { name: '🔸Current XP:', value: `🔸${xpData.XP}`, inline: true }, 
        { name: '🔸Next Level:', value: `🔸${Required}`, inline: true },
      );
  
      await ctx.interaction.reply({embeds: [rankEmbed]})
  }
})