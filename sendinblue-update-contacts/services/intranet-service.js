import mysql from 'promise-mysql';
import {attributesAbonnements, attributesContacts, attributesTypeAbonnement, databaseConfig, synchronizationPeriod} from '../config/index.js';

// Create MySQL client connection
export async function createClient() {
    console.info('Creating connection...');
    const client = await mysql.createConnection(databaseConfig);
    console.info('Connected');
    return client;
}

function buildBaseQuery(select = '', join = '', isPremium = false) {
    // WHERE ta.NOM_ABONNEMENT IN (${subscriptionStatus.map((name) => `"${name}"`).join(', ')})
    return `
        SELECT DISTINCT c.EMAIL, ${select}
        FROM intranet.contacts c
        ${join}
        WHERE c.EMAIL NOT IN (SELECT b.EMAIL FROM intranet.bounced b)
        AND c.ID_ENTREPRISE ${isPremium ? '' : 'NOT '} IN (SELECT a.ID_SOCIETE FROM intranet.abonnements a)
        AND c.OPTIN = 'oui';
        ${Number.isNaN(synchronizationPeriod) ? '' : `AND DATE (a.DATE_MAJ) > CURRENT_DATE() - ${synchronizationPeriod}`}
    `;
}

// Build a query for 'Liste Non Abonnés'
export function buildFreeQuery() {
    return buildBaseQuery(attributesContacts.map((attribute) => `c.${attribute}`));
}

// Build a query for 'Liste Abonnés'
export function buildPremiumQuery() {
    const select = [
        ...attributesAbonnements.map((attribute) => `a.${attribute}`),
        ...attributesTypeAbonnement.map((attribute) => `ta.${attribute}`),
        ...attributesContacts.map((attribute) => `c.${attribute}`)
    ].join(', ');

    const join = `
        JOIN intranet.abonnements a ON a.ID_SOCIETE = c.ID_ENTREPRISE
        JOIN intranet.type_abonnement ta ON ta.ID_TYPE_ABONNEMENT = a.STATUT_DESTINATAIRE`;

    return buildBaseQuery(select, join, true);
}
