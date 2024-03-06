const SERVICES = {
    WEB: process.env.WEB_SERVICE || "http://picarto-web.local/ptvapi",
    WIDGET: process.env.WIDGET_SERVICE || "http://localhost:9901/graphql"
}


module.exports = {
    services: [
        { name: "web", url: SERVICES.WEB },
        { name: "widget", url: SERVICES.WIDGET }
    ]
};
