import axios from 'axios';
import {forEachAsync} from '../utils/index.js';
import {attributes, freeSubscriptionListId, headers, premiumSubscriptionListId} from '../config/index.js';

function formatEmail(email) {
    // "fanny_michaud2000@yahoo.fr / fanny.michaud@nantesmetropole.fr"
    // "eduval@@kalelia.fr"
    // "caroline.pelletier31@gmail.com "
    return email.split('/')[0].replace('@@', '@').replace(' ', '');
}

function formatAttributes(contact) {
    return {
        ...Object.fromEntries(attributes.map((attribute) => [attribute, contact[attribute]])),
        email: formatEmail(contact.EMAIL)
    };
}

function formatContacts(listId) {
    return (contacts) =>
        contacts.map((contact) => ({
            email: formatEmail(contact.EMAIL),
            attributes: formatAttributes(contact),
            listIds: [listId],
            updateEnabled: true
        }));
}

export const formatFreeContacts = formatContacts(freeSubscriptionListId);
export const formatPremiumContacts = formatContacts(premiumSubscriptionListId);

function updateContacts(listName) {
    return async function updateContacts(contacts) {
        try {
            console.info(`Updating ${contacts.length} contacts in ${listName} list`);
            await forEachAsync(contacts, (contact) => axios.post('https://api.sendinblue.com/v3/contacts', contact, headers));
            console.info(`${contacts.length} ${listName} contacts updated successfully`);
        } catch (error) {
            console.error(error.response);
            throw new Error(`An error occurred while updating ${listName} contacts`, error);
        }
    };
}

export const updateFreeContacts = updateContacts('free');
export const updatePremiumContacts = updateContacts('premium');

// export async function deleteContacts(contacts) {
//     try {
//         console.info(`Deleting ${contacts.length} contacts`);
//         await forEachAsync(contacts, async (contact) => {
//             try {
//                 await axios.delete(`https://api.sendinblue.com/v3/contacts/${contact.email}`, headers);
//             } catch (error) {
//                 // Ignore users not found
//                 if (error.response.status !== 404) throw error;
//             }
//         });
//         console.info(`${contacts.length} contacts deleted successfully`);
//     } catch (error) {
//         console.error(error);
//         throw new Error('An error occurred while deleting contacts in sendinblue', error);
//     }
// }
