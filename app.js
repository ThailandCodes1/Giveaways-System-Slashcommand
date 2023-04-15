/*

 ©ThailandCodes 2023 - @Ch2mpion#3550

 a Simple Giveaways bot that was made by Discord.js ( v14 )

 There's a new Versions are coming soon ...

 Discord Server : https://discord.gg/thailandcodes
 
 */

 const { Client, Events, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
// Create a new client instance
const client = new Client({ intents : 131071  });
// When the client is ready, run this code (only once)


//Important Libraries
require('dotenv').config()
const { REST, Routes } = require('discord.js');
const  ms  = require('ms')

const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#793fdf',
       embedColorEnd : 'Red',
        reaction: '🎁'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;




client.once(Events.ClientReady, () => {

    const commands = [{
        name : "giveaway",
        description : "a completable giveaways system",
        permission: "ADMINISTRATOR",
        options:[{

name:"start",
description: "starts a giveaway",
type: 1,

options:[{
name: "duration",
description: "sets a duration to giveaway",
type: 3,
required: true


},{

name: "winners",
description: "amout of winners in the giveaway",
type: 4,
required: true

},{

    name: "prize",
    description: "insert the prize of the giveaway",
    type: 3,
    required: true
    
    },{
        name: "channel",
        description:"the channel to send the giveaway embed on",
        type: 7,
        channelTypes: ["GUILD_TEXT"],
        required: true
    }
]


        },{
            name:"actions",
            description:"system actions to select",
            type: 1,
            options:[
                {
                    name:"options",
                    description:"select an option",
                    required:true,
                    type: 3,
                    choices:[
                        {
                            name:"end",
                            value:"end"
                        },{
                            name:"pause",
                            value:"pause"
                        },{
                            name:"continue",
                            value:"continue"
                        },{
                            name:"reroll",
                            value:"reroll"
                        },{
                            name:"delete",
                            value:"delete"
                        }
                    ]
                },
                {
                    name: "message_id",
                    description:"insert the giveaway's message id",
                    type: 3,
                    required: true
                }
            ]
        }
    ]
}
 ]


    const rest = new REST().setToken(`${process.env.TOKEN}`);
    
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
    
            console.log('Successfully loaded slashs ☑ ');
        } catch (error) {
            console.error(error);
        }
    })();

    console.log(`${client.user.tag} is Ready !`);

})


client.on(Events.InteractionCreate, async interaction =>{
    if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content:"You don't have permissions to do that !", ephemeral:true});
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'giveaway'){

        const { options } = interaction;
        const Sub = options.getSubcommand();


        switch(Sub){
            case "start":{

const channel = options.getChannel("channel") || interaction.channel;
const duration = options.getString("duration");
const winners = options.getInteger("winners");
const gprize = options.getString("prize")
const successEmbed = new EmbedBuilder().setColor("Blue")
const errorEmbed = new EmbedBuilder().setColor("DarkRed")
client.giveawaysManager.start(channel, {
     duration: ms(duration),
            winnerCount:winners,
            prize:gprize ,
            lastChance: {
                enabled: true,
                content: '⚠️ **LAST CHANCE TO ENTER !** ⚠️',
                threshold: 10_000,
                embedColor: '#FF0000'
            }
}).then( async () =>{
successEmbed.setDescription("Giveaway has started !")
interaction.reply({embeds:[successEmbed], ephemeral:true})
}).catch((err) =>{
errorEmbed.setDescription(`hmm .. something happened while starting giveaway\n\n ${err}`)
interaction.reply({embeds:[errorEmbed], ephemeral:true})
})

            }
break;

case "actions":{

    const choice = options.getString("options");

switch(choice){

case "end":{

    const messageId = interaction.options.getString('message_id');
    client.giveawaysManager
        .end(messageId)
        .then(() => {

            const SucEmbed = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setDescription('Successfully ended giveaway 🎁 !')
            .setColor('Blue')
            .setFooter('©Thailand - Codes')

            interaction.reply({embeds:[SucEmbed], ephemeral:true});
        })
        .catch((err) => {
            interaction.reply({content:`An error has occurred, please check and try again.\n\`${err}\``, ephemeral:true});
        });

} break;

case "pause":{

    const messageId = interaction.options.getString('message_id');
    client.giveawaysManager
        .pause(messageId)
        .then(() => {

            const PusEmbed = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setDescription('Successfully paused giveaway 🎁 !')
            .setColor('Blue')
            .setFooter('©Thailand - Codes')

            interaction.reply({embeds:[PusEmbed], ephemeral:true});
        })
        .catch((err) => {
            interaction.reply({content:`An error has occurred, please check and try again.\n\`${err}\``, ephemeral:true});
        });

} break;

case "continue":{

    const messageId = interaction.options.getString('message_id');
    client.giveawaysManager
        .unpause(messageId)
        .then(() => {

            const ConEmbed = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setDescription('Successfully unpaused giveaway 🎁 !')
            .setColor('Blue')
            .setFooter('©Thailand - Codes')

            interaction.reply({embeds:[ConEmbed], ephemeral:true});
        })
        .catch((err) => {
            interaction.reply({content:`An error has occurred, please check and try again.\n\`${err}\``, ephemeral:true});
        });

} break;

case "reroll":{

    const messageId = interaction.options.getString('message_id');
    client.giveawaysManager
        .reroll(messageId)
        .then(() => {
            const RerEmbed = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setDescription('Successfully rerolled giveaway 🎁 !')
            .setColor('Blue')
            .setFooter('©Thailand - Codes')

            interaction.reply({embeds:[RerEmbed], ephemeral:true});
        })
        .catch((err) => {
            interaction.reply({content:`An error has occurred, please check and try again.\n\`${err}\``, ephemeral:true});
        });

} break;

case "delete":{

    const messageId = interaction.options.getString('message_id');
    client.giveawaysManager
        .delete(messageId)
        .then(() => {
            const DelEmbed = new EmbedBuilder()
            .setTitle('SUCCESS')
            .setDescription('Successfully deleted giveaway 🎁 !')
            .setColor('Blue')
            .setFooter('©Thailand - Codes')

            interaction.reply({embeds:[DelEmbed], ephemeral:true});
        })
        .catch((err) => {
            interaction.reply({content:`An error has occurred, please check and try again.\n\`${err}\``, ephemeral:true});
        });
    
} break;

default: console.log("Unknown choice ... ?");

}}

break;




             }
        }


    }
)



// Login to Discord with your client's token
client.login(process.env.TOKEN);


