const VoiceResponse = require("twilio").twiml.VoiceResponse;
const dotenv = require("dotenv").config({ path: "../config.env" });
const workflowSid = process.env.TWIML_WORKFLOW_SID;
const authToken = process.env.TWILIO_ACCOUNT_SECRET;
const workspaceSid = process.env.TWILIO_TR_WORKSPACE_SID;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require("twilio")(accountSid, authToken);

exports.welcomeMsg = () => {
  try {
    const voiceResponse = new VoiceResponse();
    console.log(voiceResponse, "Voice Response in Controller");
    const gather = voiceResponse.gather({
      action: "/incomingCall",
      numDigits: 1,
      method: "POST",
      timeout: 5,
    });

    gather.say(
      "Thanks for calling Almawiz Services. " +
        "Press 1 to talk to live agent" +
        "Press 2 to go main menu"
    );

    return voiceResponse.toString();
  } catch (error) {
    console.log(error);
  }
};

exports.inComingRequest = (digit, callerDetails) => {
  switch (+digit) {
    case 1:
      return assignAgent(callerDetails);
    case 2:
      return redirectWelcome();

    default:
      return redirectWelcome();
  }
};

////Assigning the Call to the Agent///

const assignAgent = (callerDetails) => {
  console.log("Assign Agent function in triggered");
  const twiml = new VoiceResponse();
  twiml.enqueue({
    workflowSid: workflowSid,
    workspaceSid: workspaceSid,
  });
  console.log(twiml.toString(), "Assign Agent Enqueue");
  return twiml.toString();
};

///Returns String//

const redirectWelcome = () => {
  console.log("Redirect Welcome Triggered");
  const twiml = new VoiceResponse();
  twiml.say("Returning to the Main menu");

  twiml.redirect("/welcome");

  return twiml.toString();
};
