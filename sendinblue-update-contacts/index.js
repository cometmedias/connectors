import {
    buildFreeQuery,
    buildPremiumQuery,
    createClient,
    formatFreeContacts,
    formatPremiumContacts,
    heartbeat,
    updateFreeContacts,
    updatePremiumContacts
} from './services/index.js';
import {pipeAsync} from './utils/index.js';

export async function sendinblueUpdateContacts(request, response) {
    try {
        const client = await createClient();

        await pipeAsync(buildFreeQuery, client.query.bind(client), formatFreeContacts, updateFreeContacts)();
        await pipeAsync(buildPremiumQuery, client.query.bind(client), formatPremiumContacts, updatePremiumContacts)();

        // Removing terminated subscriptions
        // await pipeAsync(
        //     //
        //     buildQueryBySubscriptionStatus(terminatedSubscriptionStatus),
        //     client.query.bind(client),
        //     formatContacts(),
        //     deleteContacts
        // )();

        await heartbeat();
        return response.send(201);
    } catch (error) {
        console.error(error);
        return response.status(500).send(error);
    }
}
