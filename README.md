# discord-alert

## Manage config.json

The file `data/config.json` contains the configuration for the servers used for listening or writing informations.

### Writers

The writers are defined in the array named **writers**
```json
{
    "writers": [
       ... 
    ]
}
```

A **writer** must contain an alias (referenced in a listener), a type and a node server for the connexion informations. 

The type allowed are :
* D : for Discord
* SMS : for sms

```json
{
  "alias" : "writerAlias",
  "type" : "D",
  "server" : {
    ...
  }  
}
```

Depending on the type of the writer, the server node changes.

#### Discord Writer

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

### Listeners

The listeners are defined in the array named **listeners** and are a collection of channel accessible from an account.
```json
{
    "listeners": [
       ... 
    ]
}
```

A listener contains 3 parts :
* the connexion information to the client `server`
* the alias of the `writer` defined above
* the list of `channels` we want to listen

#### Server part
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

#### Channels part

You can list, in this section, all the channels available from the account specify in the `server` section you want to listen.
```json
  "channels": {
    "<channel_id>": "<formater>"
  }
```

Associated to the channel_id, you have to define a formater. The current formaters are defined in `src/MessageParser` :
* MLV
* LMPM
* PDX100

You can add more support for you own channels according to the format used to publish messages 