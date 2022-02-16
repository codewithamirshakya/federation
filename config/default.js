const SERVICES = {
    AUTH: process.env.AUTH_SERVICE || "http://localhost:9999/graphql",
    CHANNEL: process.env.CHANNEL_SERVICE || "http://localhost:8001/graphql",
    EMOJI: process.env.EMOJI_SERVICE || "http://localhost:9999/graphql"

}


module.exports = {
    services: [
        { name: "auth", url: SERVICES.AUTH },
        { name: "channel", url: SERVICES.CHANNEL },
        { name: "emoji", url: SERVICES.EMOJI },
    ]
};