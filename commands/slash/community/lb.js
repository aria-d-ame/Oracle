const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const levelSchema = require('../../../schemas/level.js');

new Command({
  name: 'leaderboard',
  description: 'See the server leaderboards!',
  type: [CommandType.SLASH],

  run: async (ctx) => {
    const { guild, client } = ctx;
    await ctx.interaction.deferReply();

        // Get top 10 docs in xpData based on XP, Level fields
        const xpData = await levelSchema.find({ Guild: guild.id })
          .sort({
            XP: -1,
            Level: -1,
          })
          .limit(10);

        // Create an embed to send the leaderboard
        const xpEmbed = new EmbedBuilder()
          .setTitle(`🔸LEADERBOARD🔸`)
          .setColor(`orange`)
          .setFooter({
            text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
            iconURL: ctx.guild.iconURL()
          })
          .setTimestamp();

        // If no leaderboard, inform user.
        if (!xpData.length) {
          xpEmbed.setDescription('This server does not have a leaderboard yet!');
        } else {
          // Array consisting of name/level/xp details (string) for each user
          const userDescriptions = [];

          // Iterates through each xpData document to create name/level/xp details for user and pushes them to
          // to userDescriptions array
          for (xpDataDoc of xpData) {
            const { User, XP, Level } = xpDataDoc;
            const member = await client.users.fetch(User);
            userDescriptions.push(`${xpData.indexOf(xpDataDoc) + 1}. ${member.tag} | XP: ${XP} | Level: ${Level}`);
          };

          // Join elements in user descriptions array with \n (new line)
          xpEmbed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        // Send the leaderboard embed
        await ctx.interaction.editReply({ embeds: [xpEmbed] });

  }
})