const db = require('../../../models');
const Bot_chat = require('../../../models/mongo/bot_chat');
const OpenAI =  require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const responseFromGpt = async (history_prompt) => {
  const completion = await openai.chat.completions.create({
    messages: history_prompt,
    model: "gpt-3.5-turbo",

  });
  console.log(completion.choices[0]);
  return completion.choices[0].message.content
}

const handleChatLifeCycle = async (last_message, chat_prompt) => {
  var eventValue = 0;
  if(last_message.toString().toLowerCase().includes("connect") && last_message.toString().toLowerCase().includes("agent") ) {
      
    if(last_message.toString().toLowerCase().includes("human") || last_message.toString().toLowerCase().includes("live") || 
    last_message.toString().toLowerCase().includes("real")) {
      eventValue = 1; 
    }
    if(last_message.toString().toLowerCase().includes("assist") || last_message.toString().toLowerCase().includes("transfer") || last_message.toString().toLowerCase().includes("speak") ) {
      eventValue = 1; 
    }
  }
  else if(last_message.toString().toLowerCase().includes("connect") && last_message.toString().toLowerCase().includes("human")) {
    
     if(last_message.toString().toLowerCase().includes("human") || last_message.toString().toLowerCase().includes("live") || 
    last_message.toString().toLowerCase().includes("real")) {
      eventValue = 1; 
    }
    if(last_message.toString().toLowerCase().includes("assist") || last_message.toString().toLowerCase().includes("transfer") || last_message.toString().toLowerCase().includes("speak") ) {
      eventValue = 1; 
    }
  }
  if(eventValue == 1){
    console.log('you are talking to executive');
  }else{
    console.log('yo I am a bot');
  }
  // Handle create ticket and task if enough data is captured
  // const _chat_prompt = chat_prompt
  // _chat_prompt.push({"role": "user", "content": "Tell me the % of questions i answered / required questions to answer that system gave you?"})
  // const local_last_message = await responseFromGpt(_chat_prompt);
  // if(local_last_message.toString().includes("answered") && local_last_message.toString().includes("questions")) {

  //       // here check the % from the local_last_message;
  //   if(local_last_message.toString().includes("95") || local_last_message.toString().includes("90") ||  local_last_message.toString().includes("100")) {
  //   eventValue = 2; 
  //   }
  // }
  // else if(local_last_message.toString().includes("required") && local_last_message.toString().includes("answered")) {

  //       // here check the % from the local_last_message;
  //   if(local_last_message.toString().includes("95") || local_last_message.toString().includes("90") ||  local_last_message.toString().includes("100")) {
  //     eventValue = 2; 
  //     }
  // }

    // 1 - for Assistant assigned & 2 - for create ticket and task 
    return eventValue;
}
module.exports = {
  send_message: async (chat_id) => {
      try {
        const returnMessage = {};
        const base_prompt = await db.Chatbot.findOne({where:{id:1}});
        const chat_prompt = await db.Chat.findOne({where:{id:chat_id}});
        const history = await Bot_chat.find({chat_id});
        let history_prompt = [];
        history_prompt.push({"role": "system", "content":base_prompt.base_prompt + "\n\n" + chat_prompt.prompt});
        for(var i=0;i<history.length;i++) {
          if(history[i].sender.includes("assistant")) {
            history_prompt.push({"role": "assistant", "content":history[i].message})
          }
          else {
              history_prompt.push({"role": "user", "content":history[i].message})
            }
          }
        const gptMessage = await responseFromGpt(history_prompt);
        const lifeCycleEvent = await handleChatLifeCycle(gptMessage,history_prompt);

        returnMessage['message'] = gptMessage;
        returnMessage['lifeCycleEvent'] = lifeCycleEvent;
        returnMessage['chatPrompts'] = history_prompt;

        return returnMessage;

      } catch (error) {
          console.error('Error in gpt Message:', error);
          res.status(500).send({
              flag:false,
              message: 'Internal Server Error'+error
          });
      }
  },
}