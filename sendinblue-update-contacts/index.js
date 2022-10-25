import {
    freeSubscriptionListId,
    freeSubscriptionStatus,
    premiumSubscriptionListId,
    premiumSubscriptionStatus,
    terminatedSubscriptionStatus
} from './config/index.js';
import {buildQueryBySubscriptionStatus, createClient, deleteContacts, formatContacts, updateContacts} from './services/index.js';
import {pipeAsync} from './utils/index.js';

export async function sendinblueUpdateContacts(request, response) {
    try {
        const client = await createClient();

        // Update free subscription list
        await pipeAsync(
            buildQueryBySubscriptionStatus(freeSubscriptionStatus),
            client.query.bind(client),
            formatContacts(freeSubscriptionListId),
            updateContacts('free')
        )();

        // Update premium subscription list
        await pipeAsync(
            buildQueryBySubscriptionStatus(premiumSubscriptionStatus),
            client.query.bind(client),
            formatContacts(premiumSubscriptionListId),
            updateContacts('premium')
        )();

        // Removing terminated subscriptions
        await pipeAsync(
            //
            buildQueryBySubscriptionStatus(terminatedSubscriptionStatus),
            client.query.bind(client),
            formatContacts(),
            deleteContacts
        )();

        return response.send(201);
    } catch (error) {
        console.error(error);
        return response.status(500).send(error);
    }
}
