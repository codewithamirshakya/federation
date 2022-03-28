const SERVICES = {
    WEB: process.env.WEB_SERVICE || "http://localhost:8001/graphql",
    WIDGET: process.env.WIDGET_SERVICE || "http://localhost:9999/graphql"
}


module.exports = {
    services: [
        { name: "web", url: SERVICES.WEB },
        { name: "widget", url: SERVICES.WIDGET }
    ]
};
