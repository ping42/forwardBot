const Telebot = require('telebot')

const token = '709254913:AAGWA8101aYLdjVUR3tdGSUV_nHuykDU3rA'
const bot = new Telebot(token)

var groupList = []
var joinedMap = new Map()

bot.on('/start', (msg) => { 
    msg.reply.text('From now on, messages will be forwarded')
})

bot.on('/join', (msg) => {
    groupList.push(msg.chat.id)
    joinedMap.set(msg.chat.id, new Boolean(true))
    return bot.sendMessage(msg.chat.id, 'This ' + msg.chat.type + ' is added to the forwarding message list.')
})

bot.on('*', (msg) => {
    if (msg.text == '/join') {
        return
    }
    if (joinedMap.get(msg.chat.id) == null) {
        return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use **/join** to join')
    }
    else {
        if (groupList.includes(msg.chat.id)) {
            groupList.forEach( groupID => {
                if (groupID == msg.chat.id) {
                    return
                }
                else {
                    bot.forwardMessage(groupID, msg.chat.id, msg.message_id)
                }
            })
        }
        else {
            return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use **/join** to join')
        }
    }
})

bot.on('edit', (msg) => {
    if (groupList.includes(msg.chat.id)) {
        groupList.forEach( groupID => {
            msg.reply.text('Edited Message.', { asReply: true })
            return bot.forwardMessage(groupID, msg.chat.id, false, msg.message_id)
        })
    }
    else {
        return bot.sendMessage(msg.chat.id, 'This group has not joined to the forwarding group list. Use **/join** to join')
    }
})

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    process.exit(1) // To exit with a 'failure' code
  });

bot.start()