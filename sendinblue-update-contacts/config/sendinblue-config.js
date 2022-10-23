import {attributesAbonnements, attributesContacts, attributesTypeAbonnement} from './intranet-config.js';

const {
    // Sendinblue contact list ids
    SENDINBLUE_FREE_SUBSCRIPTION_LIST_ID,
    SENDINBLUE_PREMIUM_SUBSCRIPTION_LIST_ID,
    // Sendinblue API key
    SENDINBLUE_API_KEY
} = process.env;

export const attributes = [attributesAbonnements, ',', attributesTypeAbonnement, ',', attributesContacts].flat();

export const freeSubscriptionListId = parseInt(SENDINBLUE_FREE_SUBSCRIPTION_LIST_ID);
export const premiumSubscriptionListId = parseInt(SENDINBLUE_PREMIUM_SUBSCRIPTION_LIST_ID);

export const headers = {headers: {'api-key': SENDINBLUE_API_KEY}};
