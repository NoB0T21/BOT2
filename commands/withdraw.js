import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { UserStat } from '../models/userState.js';
import { Withdrawal } from '../models/Withdrawal.js';

const ADMIN_ID = process.env.ADMIN_USER_ID;

export const Withdraw = async (interaction,client) => {
    // Create withdraw request if >= $5
    const userId = interaction.user.id;
    let stat = await UserStat.findOne({ userId });
    if (!stat) stat = await UserStat.create({ userId, totalSeconds: 0 });

    const fullHours = Math.floor((stat.totalSeconds || 0) / 3600);
    const withdrawable = fullHours * 0.5;

    if (withdrawable < 5) {
        return interaction.reply({ ephemeral: true, content: `You need at least $5 to request a payout. You have $${withdrawable.toFixed(2)}.` });
    }

    // Create withdrawal request (status: pending)
    const req = await Withdrawal.create({
        userId,
        amount: withdrawable,
        status: 'pending',
        createdAt: new Date()
    });

    await interaction.reply({ ephemeral: true, content: `Withdrawal requested for $${withdrawable.toFixed(2)}. An admin will review it.` });

    // Notify admin(s)
    const adminUser = await client.users.fetch(ADMIN_ID).catch(() => null);
    if (adminUser) {
        const approveBtn = new ButtonBuilder().setCustomId(`approve_withdraw:${req._id}`).setLabel('Approve').setStyle(ButtonStyle.Success);
        const rejectBtn = new ButtonBuilder().setCustomId(`reject_withdraw:${req._id}`).setLabel('Reject').setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(approveBtn, rejectBtn);

        await adminUser.send({
            content: `New withdrawal request: ${req._id}\nUser: <@${userId}>\nAmount: $${withdrawable.toFixed(2)}`,
            components: [row]
        }).catch(() => console.log('Failed to DM admin'));
    }
}