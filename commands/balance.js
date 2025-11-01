import { UserStat } from '../models/userState.js';

export const Balance = async (interaction) => {
    const userId = interaction.user.id;
    let stat = await UserStat.findOne({ userId });
    if (!stat) stat = await UserStat.create({ userId, totalSeconds: 0 });
    const totalSeconds = stat.totalSeconds || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const earnings = (Math.floor(totalSeconds / 3600) * 0.5).toFixed(2);

    await interaction.reply({
        ephemeral: true,
        content: `You have spoken **${hours}h ${minutes}m** (total).\nWithdrawable: **$${earnings}**\nMinimum payout: **$5.00**`
    });
}