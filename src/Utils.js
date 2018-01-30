module.exports = {
    normalize: function (name) {
        return String(name ? name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\W/g, "").toLowerCase() : "");
    }
};