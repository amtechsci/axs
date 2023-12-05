const db = require('../models');
const Bot_chat = require('../models/mongo/bot_chat');

module.exports = {
  send_message: async (chat_id) => {
      try {
        const base_prompt = await db.Chatbot.findOne({where:{id:1}});
        const chat_prompt = await db.Chat.findOne({where:{id:chat_id}});
        const history = await Bot_chat.find({chat_id});
        let history_prompt = [];
        history_prompt.push({"system":base_prompt.base_prompt.toString().append('\n' + chat_prompt.prompt.toString())});
        //iterate over history and add objects in History_prompt   {"user":history[i].message}
      } catch (error) {
          console.error('Error in login:', error);
          res.status(500).send({
              flag:false,
              message: 'Internal Server Error'+error
          });
      }
  },
}