export function pipeAsync(...fns) {
    return (arg) => fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
}
