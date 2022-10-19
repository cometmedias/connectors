import axios from 'axios';
import postgres from 'pg';
import {freeSubscriptionStatus, premiumSubscriptionStatus, terminatedSubscriptionStatus} from './constants.js';
import {pipeAsync} from './utils/index.js';

const {FREE_SUBSCRIPTION_LIST_ID, PREMIUM_SUBSCRIPTION_LIST_ID} = process.env;

function createQueryBySubscriptionStatus(subscriptionStatus) {
    return `
        SELECT c.EMAIL, c.CIVILITE, c.NOM, c.PRENOM, ta.NOM_ABONNEMENT
        FROM abonnements a
        JOIN contacts c ON a.ID_SOCIETE = c.ID_ENTREPRISE
        JOIN type_abonnement ta ON a.STATUT_DESTINATAIRE = ta.ID_TYPE_ABONNEMENT
        WHERE ta.NOM_ABONNEMENT IN (${subscriptionStatus.map((name) => `"${name}"`).join(', ')})
        GROUP BY c.email
        ORDER BY DATE (a.DATE_MAJ) DESC LIMIT 1;
    `;
}

function getRowResults(results) {
    return results.map((result) => result.rows);
}

function setListId(listId) {
    return (contacts) => contacts.map((contact) => ({...contact, listIds: [listId], updateEnabled: true}));
}

async function updateContacts(contacts) {
    try {
        console.info(`Updating ${contacts.length} contacts in sendinblue`);
        await Promise.all(contacts.map(async (contact) => await axios.post('https://api.sendinblue.com/v3/contacts', contact, headers)));
    } catch (error) {
        console.error(error.response);
        throw new Error('An error occurred while updating contacts in sendinblue', error);
    }
}

async function deleteContacts(contacts) {
    try {
        console.info(`Deleting ${contacts.length} contacts in sendinblue`);
        await Promise.all(contacts.map(async (contact) => await axios.delete(`https://api.sendinblue.com/v3/contacts/${contact.email}`, headers)));
    } catch (error) {
        console.error(error.response);
        throw new Error('An error occurred while deleting contacts in sendinblue', error);
    }
}

export async function sendinblueUpdateContacts(request, response) {
    try {
        // Using Pool instead of regular Client because of cloudfunction special environment
        const client = new postgres.Pool({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE
        });

        await pipeAsync(createQueryBySubscriptionStatus, client.query, getRowResults, setListId(FREE_SUBSCRIPTION_LIST_ID), updateContacts)(freeSubscriptionStatus);
        await pipeAsync(createQueryBySubscriptionStatus, client.query, getRowResults, setListId(PREMIUM_SUBSCRIPTION_LIST_ID), updateContacts)(premiumSubscriptionStatus);
        await pipeAsync(createQueryBySubscriptionStatus, client.query, getRowResults, deleteContacts)(terminatedSubscriptionStatus);

        response.send(201);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
}
