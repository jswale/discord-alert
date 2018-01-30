function getValue(min, max) {
    return Math.min(Math.max(min, Math.round(Math.random() * max)), max);
}

module.exports = {
    pokemon: function (id, i) {
        return {
            id: id,
            name: `Pokemon #${i}`,
            lvl: getValue(1, 35),
            pc: getValue(10, 2000),
            iv: getValue(1, 100),
        }
    }
};