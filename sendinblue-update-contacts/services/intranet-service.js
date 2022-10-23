import mysql from 'promise-mysql';
import {attributesAbonnements, attributesContacts, attributesTypeAbonnement, databaseConfig, synchronizationPeriod} from '../config/index.js';

// Create MySQL client connection
export async function createClient() {
    console.info('Creating connection...');
    const client = await mysql.createConnection(databaseConfig);
    console.info('Connected');
    return client;
}

// Build a query
export function buildQueryBySubscriptionStatus(subscriptionStatus) {
    const select = [
        ...attributesAbonnements.map((attribute) => `a.${attribute}`),
        ...attributesTypeAbonnement.map((attribute) => `ta.${attribute}`),
        ...attributesContacts.map((attribute) => `c.${attribute}`)
    ].join(', ');

    return () => `
        SELECT ${select}
        FROM abonnements a
        JOIN contacts c ON a.ID_SOCIETE = c.ID_ENTREPRISE
        JOIN type_abonnement ta ON a.STATUT_DESTINATAIRE = ta.ID_TYPE_ABONNEMENT
        WHERE ta.NOM_ABONNEMENT IN (${subscriptionStatus.map((name) => `"${name}"`).join(', ')})
        ${Number.isNaN(synchronizationPeriod) ? '' : `AND DATE (a.DATE_MAJ) > CURRENT_DATE() - ${synchronizationPeriod}`}
        GROUP BY c.email
        ORDER BY DATE (a.DATE_MAJ) DESC;
    `;
}
