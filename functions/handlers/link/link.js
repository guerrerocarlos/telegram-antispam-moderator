"use strict";
//libs
//modules
const bot = require('../../components/bot');
const db = require('../../components/db');
const getDomain = require('../../components/getDomain');
const extractEnteties = require('../../components/extractEnteties');
//init
const isBlacklisted = async function ({chat, text, entities}) {
    const [blacklistedDomains, blacklistedLinks] = await Promise.all([
        db.getBlacklistedDomains(chat.id),
        db.getBlacklistedLinks(chat.id),
    ]);

    const links = extractEnteties({text, entities}, 'url');
    for (let link of links) {
        const domain = getDomain(link);
        for (let blockedDomain of blacklistedDomains) {
            if (domain === blockedDomain) {
                return {
                    domain: true,
                    link: false,
                    reason: link
                }
            }
        }
        for (let blockedLink of blacklistedLinks) {
            const cleanLink = link.replace('http://', '').replace('https://', '');
            const cleanBlockedLink = blockedLink.replace('http://', '').replace('https://', '');
            if (cleanLink.indexOf(cleanBlockedLink) === 0) {
                return {
                    domain: false,
                    link: true,
                    reason: link
                }
            }
        }
    }

    return {
        domain: false,
        link: false,
        reason: null
    }
};

module.exports = async function (message) {
    if (!message) return;
    const {entities, message_id, chat, text, from} = message;

    //extract links
    const links = extractEnteties({text, entities}, 'url');
    if (links.length === 0) return Promise.resolve(null);

    //get managers from DB
    const {managers} = await db.getGroup(chat.id);

    //check for backlisted link or domain
    const blacklisted = await isBlacklisted(message);

    if (blacklisted.domain || blacklisted.link) {
        const promises = [];
        promises.push(bot.deleteMessage(chat.id, message_id));
        promises.push(bot.restrictChatMember(chat.id, from.id, {can_send_messages: false}));

        for (let managerId of managers) {
            promises.push(bot.sendMessage(managerId, `Сообщение, содержащее ссылку ${blacklisted.reason} удалено - ${blacklisted.domain ? 'домен найден' : 'ссылка найдена'} в черном списке. 
${from.first_name} ${from.last_name} лишен возможности писать сообщения.`));
        }

        return await Promise.all(promises);
    }

    const [link] = links;
    const domain = getDomain(link);

    const newMessageText = `В собщении содержится ссылка [${link}](${link}).
Сообщение можно просто удалить, удалить блокировкой ссылки или всего домена.
Автор будет забанен.`;

    const messagePromises = managers.map(async function (managerId) {
        const forwardedMessage = await bot.forwardMessage(managerId, chat.id, message_id);

        await bot.sendMessage(managerId, newMessageText, {
            reply_to_message_id: forwardedMessage.message_id,
            reply_markup: {
                inline_keyboard:
                    [
                        [
                            {
                                text: 'Не спам',
                                callback_data: `approve_${chat.id}_${message_id}`
                            },
                            {
                                text: 'Бан+Удалить сообщение',
                                callback_data: `deleteOriginal_${chat.id}_${message_id}`
                            },
                        ],
                        [
                            {
                                text: 'Бан+Домен в blacklist ' + domain,
                                callback_data: `blockDomain_${chat.id}_${message_id}`
                            },
                            {
                                text: 'Бан+Ссылку в blacklist',
                                callback_data: `blockLink_${chat.id}_${message_id}`
                            },
                        ]
                    ]
            },
            parse_mode: 'Markdown'
        });
    });
    await messagePromises;

    return true;
};