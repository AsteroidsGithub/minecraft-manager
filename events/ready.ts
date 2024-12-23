import { EventConstructor } from "../interfaces/discordApplication";

const event: EventConstructor = {
    name: "ready",
    once: true,
    run: (client) => {
        if (!client.user) {
            throw new Error("Client is not logged in!");
        }

        console.log(`Logged in as ${client.user.tag}`);
    },
};

export default event;
