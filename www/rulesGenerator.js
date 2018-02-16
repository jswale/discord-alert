$(function () {
    let Ruler = {
        load: function () {
            let self = this;
            let name = $('[name="rule-name"]').val();
            if (name) {
                $.get("/serverSide/rule/" + name, function (rules) {
                    self.render(rules);
                })
            }
        },

        render: function (rules) {
            let self = this;
            $("#rules").empty();
            if (rules) {
                $.each(rules, function (ruleId, rule) {
                    self.addRule(rule);
                });
            } else {
                self.addRule();
            }
        },

        save: function () {
            let self = this;
            let name = $('[name="rule-name"]').val();
            let json = [];
            $('.rule').each(function (i, rule) {
                let entry = {
                    "destinations": self.getGroupValue($(rule), ".destination", ['writer', 'name', 'group', 'mentions']),
                    "filters": self.getGroupValue($(rule), ".filter", ['pokemons', 'country', 'excludePokemons', 'pc', 'lvl', 'iv', 'city'])
                };
                json.push(entry);
            });
            $.post("/serverSide/rule/" + name, {json: JSON.stringify(json)}, function () {
                alert("Sauvegardé");
            })

        },

        getGroupValue: function (ctn, selector, keys) {
            let self = this;
            return ctn.find(selector).map(function (i, group) {
                group = $(group);
                let entry = {};
                $.each(keys, function (i, key) {
                    let value = self.getFieldValue(group, key);
                    if (value) {
                        entry[key] = value;
                    }
                });
                return entry;
            }).get();
        },

        getFieldValue: function (ctn, name) {
            let field = ctn.find("input[name='" + name + "']");
            let value = field.val().trim();
            if (value === '') {
                return null;
            }
            let values = $.map(value.split(','), function (v) {
                v = v.trim();
                return $.isNumeric(v) ? parseInt(v, 10) : v;
            });
            return values.length === 1 ? values[0] : values;
        },

        addRule: function (rule) {
            let self = this;

            let ruleCtn = $("<fieldset/>")
                .addClass('rule')
                .append(
                    $('<legend/>').text('Règle'),
                    $('<div/>'),
                    $('<button/>').addClass('btn btn-danger').text('Supprimer cette règle').click(function () {
                        if (ruleCtn.siblings().length === 0) {
                            self.addRule();
                        }
                        ruleCtn.remove();
                    })
                )
                .appendTo($("#rules"));

            this.addGroups(ruleCtn, {
                key: 'destination',
                name: 'destination',
                data: rule && rule.destinations,
                fields: [
                    {key: 'writer', name: 'Writer', value: 'main', required: true}, {
                        key: 'name', name: 'Salon', required: true
                    },
                    {key: 'group', name: 'Catégorie', required: true},
                    {key: 'mentions', name: 'Mentions'}
                ]
            });

            this.addGroups(ruleCtn, {
                key: 'filter',
                name: 'filtre',
                data: rule && rule.filters,
                fields: [
                    {key: 'iv', name: 'IV', placeholder: 'ex: 100 ou 90,100'},
                    {key: 'pc', name: 'PC', placeholder: 'ex: 2000,9999'},
                    {key: 'lvl', name: 'LV', placeholder: 'ex: 30 ou 30,35'},
                    {key: 'country', name: 'Pays', placeholder: 'ex: fr ou fr,us,jp'},
                    {key: 'pokemons', name: 'Pkm recherchés', placeholder: 'ex: 1,2,3,4'},
                    {key: 'excludePokemons', name: 'Pkm à exclure', placeholder: 'ex: 5,6'}
                ]
            });
        },

        addGroups: function (ctn, def) {
            let self = this;

            let ctnGroup = $("<fieldset/>")
                .addClass("groups")
                .addClass(def.key + 's')
                .append($('<legend/>').text(def.name + 's'))
                .append($('<div/>'))
                .append(
                    $('<button/>')
                        .addClass('btn btn-primary')
                        .text('Ajouter ' + def.name)
                        .click(function () {
                            self.addGroup(ctnGroup, def);
                        }))
                .appendTo(ctn.find(" > div"));

            if (def.data) {
                $.each(def.data, function (key, value) {
                    self.addGroup(ctnGroup, def, value);
                });
            } else {
                self.addGroup(ctnGroup, def);
            }
        },

        addGroup: function (ctnGroup, def, data) {
            let self = this;

            let group = $("<fieldset/>")
                .addClass("group")
                .addClass(def.key)
                .append(
                    $('<legend/>').append(def.name),
                    $.map(def.fields, function (field) {
                        return self.getBasicField(data, field.key, field);
                    }),
                    $('<button/>').addClass('btn btn-danger').text('X').click(function () {
                        if (group.siblings().length === 0) {
                            self.addGroup(ctnGroup, def);
                        }
                        group.remove();
                    })
                );
            group.appendTo(ctnGroup.find(' > div'));
        },

        getBasicField(data, key, opts) {
            let input = $('<input/>')
                .addClass("form-control")
                .attr('type', 'text')
                .attr('name', key)
                .attr('placeholder', opts.placeholder)
                .val(data && data[key] || opts.value);
            if (opts.required) {
                input.attr('required', 'required');
            }
            return $('<div/>').addClass('basicField').append(
                $('<span/>').text(opts.name + ' ' + (opts.required ? '* ' : '')),
                input,
                opts.help ? $('<div/>').addClass('help').append(opts.help) : null
            );
        }
    };

    Ruler.addRule();
    document.Ruler = Ruler;
});