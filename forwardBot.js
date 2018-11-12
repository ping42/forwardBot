const Telebot = require('telebot')

const token = 'Token_Here'
const bot = new Telebot({
    token: token,
    polling: {
        interval: 100
    }
})

var groupList = []
var startForward = false

bot.on('/join', (msg) => {
    if (groupList.includes(msg.chat.id)) {
        return bot.sendMessage(msg.chat.id, 'This group has already joined the forwarding list.')
    }
    else {
        groupList.push(msg.chat.id)
        return bot.sendMessage(msg.chat.id, 'This ' + msg.chat.type + ' is added to the forwarding message list.')
    }
    
})

bot.on('/unjoin', (msg) => {
    if (groupList.includes(msg.chat.id)) {
        var index = groupList.indexOf(msg.chat.id)
        groupList.splice(index, 1)
        return bot.sendMessage(msg.chat.id, 'This group has been removed from the forwarding list.')
    }
    else {
        return bot.sendMessage(msg.chat.id, 'This group is not in the forwarding list.')
    }
})

bot.on('/startforwarding', (msg) => {
    startForward = true
    groupList.forEach( groupID => {
        bot.sendMessage(groupID, 'Forwarding Start.')
    })
})

bot.on('/stopforwarding', (msg) => {
    startForward = false
    groupList.forEach( groupID => {
        bot.sendMessage(groupID, 'Forwarding Stop.')
    })
})

bot.on('*', (msg) => {
    if (msg.text == '/join') {
        return
    }
    if (startForward == true) {
        if (groupList.includes(msg.chat.id)) {
            groupList.forEach( groupID => {
                if (groupID == msg.chat.id) {
                    return
                }
                else {
                    return bot.forwardMessage(groupID, msg.chat.id, msg.message_id)
                }
            })
        }
        else {
            return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use /join to join.')
        }

        
        // if (joinedMap.get(msg.chat.id) == null) {
        //     return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use **/join** to join')
        // }
        // else {
        //     if (groupList.includes(msg.chat.id)) {
        //         groupList.forEach( groupID => {
        //             if (groupID == msg.chat.id) {
        //                 return
        //             }
        //             else {
        //                 bot.forwardMessage(groupID, msg.chat.id, msg.message_id)
        //             }
        //         })
        //     }
        //     else {
        //         return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use **/join** to join')
        //     }
        // }
    }
})

bot.on('edit', (msg) => {
    if (startForward == true) {
        if (groupList.includes(msg.chat.id)) {
            groupList.forEach( groupID => {
                if (groupID == msg.chat.id) {
                    return
                }
                else {
                    bot.sendMessage(groupID, 'Message Edit detected.')
                    return bot.forwardMessage(groupID, msg.chat.id, false, msg.message_id)
                }
            })
        }
        else {
            return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use /join to join.')
        }
    }
})

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    //process.exit(1) // To exit with a 'failure' code
  });

bot.start()