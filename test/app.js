const assert = require('assert');

describe('Parsers', function () {

    let tests = [{
        parser: 'pokedex100',
        useCases: [
            {
                title: "with despawn",
                message: `:flag_jp:  (01:18) **Zangoose** <a:335:396708221244538890>  IV100** CP1993 L33** ♀ [Shadow Claw/Night Slash]  -  *Choshoji*  <@342599857648697348>
Click to get coord <https://pokedex100.com/?d=QdEs6NXvzvkMW>

Support us >> <https://www.patreon.com/pokedex100>`
            },
            {
                title: "without more info",
                message: `:flag_us:  **Wurmple** <a:265:396700075344003072>  IV100** CP437 L31** ♂ [Bug Bite/Struggle] WXL -  *Glen Allen*  <@288375537410375681>
Click to get coord <https://pokedex100.com/?d=DswbT7RBDn3vW>

Support us >> <https://www.patreon.com/pokedex100>`
            }, {
                title: "basic",
                message: `:flag_jp:  **Eevee** <a:133:396695198002053131>  IV100** CP899 L35** ♂ [Quick Attack/Swift]  -  *Kita-Toyama*  <@342599857648697348>
Click to get coord <https://pokedex100.com/?d=Q2j8zzivEtoMW>

Support us >> <https://www.patreon.com/pokedex100>`
            }
        ]
    }, {
        parser: 'mapLaVallee',
        useCases: [
            {
                title: "unknown", message: `IV : ???% (?/?/?)
LV : ? | PC : ?
unknown / unknown

48.8469334692,2.69656179552
http://pog.ovh/cc/?lat=48.84693&lon=2.69656&pkm_id=252

14 Rue de Saint-Martin 77600 Bussy-Saint-Georges
Depop : 23:30:07 (20m 45s)`
            }
        ]
    }, {
        parser: 'livePokeMapParis',
        useCases: [{
            title: 'boosted with street',
            message: '[95100] : **Lovdisc** ♀  IV**100%** LVL**31** PC**641** Despawn 09:37 **Boost météo Pluie** (15/15/15) (Trempette/Aqua-Jet) (80 Rue Ferdinand Berthoud, 95100 Argenteuil, France) https://www.google.com/maps?q=48.93770033999660%2C2.23513714973061',
        }, {
            title : 'boosted without street',
            message : '[78240] : **Evoli** ♂  IV**100%** LVL**8** PC**218** Despawn 11:21 **Boost météo Quelques nuages** (15/15/15) (Vive-Attaque/Météores) (78240 Chambourcy, France) https://www.google.com/maps?q=48.90849552668000%2C2.03404184756808'
        }, {
            title: 'normal with street',
            message: '[94200] : **Lovdisc** ♀  IV**100%** LVL**7** PC**143** Despawn 09:43 (15/15/15) (Pistolet à O/Vampibaiser) (64 Rue Maurice Gunsbourg, 94200 Ivry-sur-Seine, France) https://www.google.com/maps?q=48.81220726764360%2C2.39921247836524'
        }, {
            title: 'normal without street',
            message: '[95100] : **Rattata** ♂  IV**100%** LVL**27** PC**453** Despawn 09:43 (15/15/15) (Vive-Attaque/Croc de Mort) (95100 Argenteuil, France) https://www.google.com/maps?q=48.93536562420410%2C2.24180558321670'
        }]
    }
    ];

    tests.forEach(function (test) {
        let Parser = require(`../src/parsers/${test.parser}.parser`);
        describe(`${Parser.code}: ${test.parser}`, function () {
            test.useCases.forEach(function (useCase) {
                it(`${useCase.title}`, function () {
                    assert.notEqual(Parser.extractor.exec(useCase.message), null);
                });
            });

        });
    });

});