import axios from 'axios';

async function getContacts() {
    try {
        console.info('Getting contacts from database');
        return Promise.resolve([
            {
                email: 'contact@fabienrenaud.fr',
                attributes: {nom: 'RENAUD', prénom: 'Fabien', sms: ''},
                listIds: [2],
                updateEnabled: true
            }
        ]);
    } catch (error) {
        throw new Error('An error occurred while getting contacts from database', error);
    }
}

async function updateContacts(contacts) {
    try {
        console.info('Updating contacts in sendinblue');
        await axios.post('https://api.sendinblue.com/v3/contacts', contacts);
    } catch (error) {
        throw new Error('An error occurred while updating contacts in sendinblue', error);
    }
}

async function sendinblueUpdateContacts(request, response) {
    try {
        const contacts = await getContacts();
        // await updateContacts(contacts);
        response.send(201);
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    }
}

export {sendinblueUpdateContacts};
