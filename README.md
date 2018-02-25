# discord-alert

## Manage config.json

The file `data/config.json` contains the configuration for the servers used for listening or writing informations.

### Writers

The writers are defined in the array named **writers**
```json
{
    "writers": [        
    ]
}
```

A **writer** must contain an alias (referenced in a listener), a type and a node server for the connexion informations. 

The type allowed are :
* DISCORD : for Discord (by default is node `type` is missing)
* SMS : for sms
* API : for api
* CONSOLE : for logging in the console

```json
{
  "alias" : "writerAlias",
  "type" : "DISCORD",
  "server" : {
  }  
}
```

Depending on the type of the writer, the server node changes.

#### Discord Writer

__Important__:  Check that the account used to publish informations is allowed to manage channels

We first need an ID of a guild (you can find it on the URL of the web application of discord) to write the messages 
```json
{
  "server" : {
    "guild" : "<ID>"
  }  
}
```

We can connect to the server using the private token (of a bot or an user) :
```json
{
  "server" : {
    "guild" : "<ID>",
    "token" : "<secret_token>"
  }  
}
```

Or connect using login/password :
```json
{
  "server" : {
    "guild" : "<ID>",
    "login" : "email@client.com",
    "password" : "myPassword"
  }  
}
```

#### Sms Writer

Some cellphone providers allow to send SMS using some REST API in GET. You must provide an url and use `{message}` to inject the body of the message.
 
```json
{
  "server" : {
    "url" : "https://api.provider.com/sms/?message={message}"
  }  
}
```


#### Api Writer

You can send the pokemon object to an remote API.
 
```json
{
  "server" : {
    "url" : "https://api.website.com"
  }  
}
```

### Listeners

The listeners are defined in the array named **listeners** and are a collection of channel accessible from an account.
```json
{
    "listeners": [
    ]
}
```

A listener contains :
* the `type` of listener
* the connexion information to the client `server`
* the list of `channels` we want to listen
* the list of `guilds` we want to listen (you can defined `guilds` and `channels`)

#### Type part

A **listener** must contain a `type`. 

The type allowed are :
* DISCORD : for Discord (by default is node `type` is missing)
* FAKE : for fake data

```json
{
  "alias" : "writerAlias",
  "type" : "DISCORD",
  "server" : {
  }  
}
```


#### Server part (Discord)
The same way you can configure the connexion with the writer are available for the listeners (without the guild information).

Using the private token (of a bot or an user) :
```json
{
  "server" : {
    "token" : "<secret_token>"
  }  
}
```

Or using login/password :
```json
{
  "server" : {
    "login" : "email@client.com",
    "password" : "myPassword"
  }  
}
```

#### Server part (Fake)
If you want to check some fake datas you can set some informations about the pokemons :

* `names` the list of pokemon names (default to `pikachu`)
* `level` the level or range of level (ex: `30` or `[30,35]`)
* `iv` the iv or range of iv (ex: `100` or `[90,100]`)
* `pc` the pc or range of pc (ex: `2000` or `[10,100]`)
* `country` the list of countries (ex: `["fr"]`)

```json
{
  "server" : {
    "names" : ["Tylton"],
    "level" : 30,
    "iv" : 100,
    "pc" : [10,100],
    "country" : ["fr"]
  }  
}
```

#### Guilds part

You can list, in this section, all the guilds available from the account specify in the `server` section you want to listen.
```json
{
  "guilds" : {
    "<guild_id>": "<formater>"
  }
}
```

Associated to the channel_id, you have to define a formater. The current formaters are defined in the folder `src/parsers` :
* MLV
* LMPM
* PDX100

You can add more support for you own channels according to the format used to publish messages 

#### Channels part

You can list, in this section, all the channels available from the account specify in the `server` section you want to listen.
```json
{
  "channels" : {
    "<channel_id>": "<formater>"
  }
}
```

Associated to the channel_id, you have to define a formater. The current formaters are defined in the folder `src/parsers` :
* MLV
* LMPM
* PDX100

You can add more support for you own channels according to the format used to publish messages 

## Manage routes

The folder `data/routes` contains the routes used to broadcast the messages.

The route files can be generated using the generator available on http://localhost:3000 and are saved using the suffix `.routes.json`

A route file is a collection or rules defined as

```json
{
  "destinations" : [],
  "filters" : []
}
```

### Route destination

A message can be broadcast to multiple writers (ak destinations). For example to a discord channel and via SMS.

#### Discord writer

In order to user a discord writer you can set the destination as below :
 
 ```json
 {
   "writer" : ["main"],
   "name" : "channelName",
   "group" : "categoryName"
 }
 ```
 
You can use a single writer using `'main"` or a collection or writers using `['main"]` where `main` is the alias of the writer as describe before.

The `name` has to be one word and written in lowercase
The `group` can be a sentance (ex: `Per user`).

#### Sms writer

In order to user a sms writer you only have to set the writer :
 
 ```json
 {
   "writer" : ["sms"]
 }
 ```
 
The writer `sms` is the alias of the writer as describe before.

### Route filters

A route contains a collection of filters. You can filter the messages by setting one or multiple filters :
* **pokemons**: the list of pokemons number you want to match. Use `"*"` for matching every pokemon, or `[1,2,3]` for specific pokemon numbers
* **excludePokemons**: the list of pokemons number you want to exclude. Use `[3,4]` for specific pokemon numbers
* **lvl**: the level of the pokemon. Use `30` for matching every pokemon lvl 30 or `[30,35]` for pokemon having a level between 30 and 35.
* **iv**: the IV of the pokemon. Use `100` for matching every pokemon IV 100 or `[90,100]` for pokemon having a IV between 90 and 100.
* **pc**: the PC of the pokemon. Use `2000` for matching every pokemon PC 2000 or `[2000,9999]` for pokemon having a PC greater than 2000.
* **country**: the coutry of origin of the pokemon. Use `['fr']` for matching every pokemon from France or `['fr', 'us"]` for pokemon from France or USA.
* **city**: the city name of the pokemon 
* **channelId**: the id of the source channel
* **channelName**: the name of the source channel 
* **guildId**: the id of the source channel guild
* **guildName**: the name of the source channel guild
* **postalCode**: the exact of beginning of the postal code
* **source**: the source 

*Example for IV100 LVL30+*
 ```json
{
  "pokemons": "*",
  "lvl": [30,35],
  "iv": 100
}
 ```

*Example for IV100 LVL35 from France*
 ```json
{
  "pokemons": "fr",
  "lvl": 35,
  "iv": 100
}
 ```

### Full example
[
  {
    "destinations" :[{
      "writer" : ["main"],
      "name":"debug",
      "group": "Debug"
    }],
    "filters": [
      {
        "pokemons": "*",
        "lvl": [1,35],
        "iv": 100
      }
    ]
  }
]