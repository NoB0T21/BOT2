import { Withdrawal } from '../models/Withdrawal.js';
import { handleApproveWithdraw } from '../stripe/payment/admin.js'
const ADMIN_ID = process.env.ADMIN_USER_ID;

export const HandleWithdraw = async (interaction,client) => {
    const customId = interaction.customId;
    if (customId.startsWith('approve_withdraw:') || customId.startsWith('reject_withdraw:')) {
        if (interaction.user.id !== ADMIN_ID) return interaction.reply({ content: 'You are not authorized.', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });
        const [action, id] = customId.split(':');

        if (action === 'approve_withdraw') {
            const res = await handleApproveWithdraw(id, client, interaction);
            return interaction.editReply({ content: res });
        } else {
            // reject
            const request = await Withdrawal.findById(id);
            if (!request) return interaction.editReply({ content: 'Request not found.' });

            request.status = 'rejected';
            await request.save();

            return interaction.editReply({ content: `Request ${id} rejected.` });
        }
    }
}