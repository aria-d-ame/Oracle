const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js')
const levelSchema = require('../schemas/level.js');

new Listener({
  name: 'XP Gain',
  event: 'messageCreate',

  run: async (ctx) => {
    const cooldownTime = 10 * 1000; // 10 seconds

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    };
        const { guild, author, member } = ctx;
        if (!guild || author.bot) return;

        try {
            // Find or create a level record
            let data = await levelSchema.findOne({ Guild: guild.id, User: author.id });
            if (!data) {
                data = await levelSchema.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0,
                    LastXPTime: Date.now(),
                });
            }
            const levelRoles = [
                { level: 0, roleId: '1329965386262646907' },
                { level: 5, roleId: '1329965566907121765' },
                { level: 10, roleId: '1329965630312546314' },
                { level: 20, roleId: '1329966035562135562' },
                { level: 30, roleId: '1329966100800344094' },
                { level: 40, roleId: '1329966206320640020' },
                { level: 50, roleId: '1329966271596466230' },
                { level: 60, roleId: '1329966441918763070' },
                { level: 70, roleId: '1329966488634916865' },
                { level: 80, roleId: '1329966556855144551' },
                { level: 90, roleId: '1329966610823512175' },
                { level: 100, roleId: '1329966662879023140' }
            ];

            const levelUpChannelId = '1329925666023673996';
            const levelUpChannel = await guild.channels.fetch(levelUpChannelId);

            const currentTime = Date.now();
            const timeSinceLastXP = currentTime - data.LastXPTime;

            if (timeSinceLastXP < cooldownTime) {
                console.log(`User ${author.id} is still in cooldown.`);
                // Skip XP awarding if the cooldown period has not passed
                return;
            }

            const minGive = 5;
            const maxGive = 10;
            const give = getRandomInt(minGive, maxGive);

            const requiredXP = data.Level * data.Level * 30;

            console.log(data.XP, give, data.XP + give, requiredXP)
            // console.log(levelRoles[2])e

            if (data.XP + give >= requiredXP) {
                data.XP += give;
                data.Level += 1;
                await data.save();

                // Assign the role and reward money when they reach a specified level
                const currentLevel = data.Level;
                // Checks if current level is a milestone
                if (levelRoles.some(role => role.level === currentLevel)) {
                    // ID and money award of the role to be added to member
                    const { roleId, level } = levelRoles.find(role => role.level === currentLevel);
                    const rolesToBeRemoved = []

                    // Add roleids that are not the current milestone role id to rolesToBeRemoved
                    for (role of levelRoles) {
                        if (role.roleId !== roleId) rolesToBeRemoved.push(role.roleId)
                    }

                    // Add milestone role to user
                    await member.roles.add(roleId);
                    console.log(`Assigned level ${level} milestone role to ${author.tag}`);

                    // Remove previous milestone roles from user
                    await member.roles.remove(rolesToBeRemoved);
                    console.log(`Removed previous milestone roles from ${author.tag}`)

                    // Send level up message with milestone notification
                    const embedrole = new EmbedBuilder()
                        .setColor(`orange`)
                        .setDescription(`🔸${author} has hit a level milestone (<@${roleId}>)!`);

                    await levelUpChannel.send({ embeds: [embedrole] });
                }

                // Send level up message without milestone notification
                const embed = new EmbedBuilder()
                    .setColor(`orange`)
                    .setDescription(`🔸${author} has reached level ${data.Level}!`);

                await levelUpChannel.send({ embeds: [embed] });
            } else {
                data.XP += give;
                data.LastXPTime = Date.now();

                await data.save();


            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
  }
})