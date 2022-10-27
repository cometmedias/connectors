import directus from 'directus';
const {createApp} = directus;

export async function entrypoint(request, response) {
    const app = await createApp();
    return app._router.handle(request, response);
}
