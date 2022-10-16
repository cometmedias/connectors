import axios from 'axios';

const {FREE_SUBSCRIPTION_LIST_ID, PREMIUM_SUBSCRIPTION_LIST_ID, SENDINBLUE_API_KEY} = process.env;

const headers = {headers: {'api-key': SENDINBLUE_API_KEY}};

async function getFreeSubscriptionContacts() {
    try {
        console.info('Getting free subscription contacts from database');
        const contacts = await Promise.resolve([{email: 'free@fabienrenaud.fr', attributes: {NOM: 'RENAUD', PRENOM: 'Fabien', SMS: ''}}]);
        return contacts.map((contact) => ({...contact, listIds: [FREE_SUBSCRIPTION_LIST_ID], updateEnabled: true}));
    } catch (error) {
        throw new Error('An error occurred while getting free subscription contacts from database', error);
    }
}

async function getPremiumSubscriptionContacts() {
    try {
        console.info('Getting premium subscription contacts from database');
        const contacts = await Promise.resolve([
            {email: 'premium@fabienrenaud.fr', attributes: {NOM: 'RENAUD', PRENOM: 'Fabien', SMS: ''}},
            {email: 'terminated@fabienrenaud.fr', attributes: {NOM: 'RENAUD', PRENOM: 'Fabien', SMS: ''}}
        ]);
        return contacts.map((contact) => ({...contact, listIds: [PREMIUM_SUBSCRIPTION_LIST_ID], updateEnabled: true}));
    } catch (error) {
        throw new Error('An error occurred while getting premium subscription contacts from database', error);
    }
}

async function getTerminatedSubscriptionContacts() {
    try {
        console.info('Getting terminated subscription contacts from database');
        return Promise.resolve([{email: 'terminated@fabienrenaud.fr', attributes: {NOM: 'RENAUD', PRENOM: 'Fabien', SMS: ''}}]);
    } catch (error) {
        throw new Error('An error occurred while getting terminated subscription contacts from database', error);
    }
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

async function sendinblueUpdateContacts(request, response) {
    try {
        const freeSubscriptionContacts = await getFreeSubscriptionContacts();
        const premiumSubscriptionContacts = await getPremiumSubscriptionContacts();
        const terminatedSubscriptionContacts = await getTerminatedSubscriptionContacts();

        await updateContacts([...freeSubscriptionContacts, ...premiumSubscriptionContacts]);
        await deleteContacts(terminatedSubscriptionContacts);
        response.send(201);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
}

export {sendinblueUpdateContacts};
