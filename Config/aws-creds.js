const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const client = new SSMClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const getParameter = async (name) => {
  const params = {
    Name: name,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(params);
  const response = await client.send(command);
  return response.Parameter.Value;
};

module.exports = {
  getParameter,
};
