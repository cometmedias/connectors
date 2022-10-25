import axios from 'axios';

const {BETTER_UPTIME_HEARTBEAT_URL} = process.env;

export async function heartbeat() {
    BETTER_UPTIME_HEARTBEAT_URL && (await axios.get(BETTER_UPTIME_HEARTBEAT_URL));
}
