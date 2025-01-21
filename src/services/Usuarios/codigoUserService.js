const AWS = require('aws-sdk');
const crypto = require('crypto')
// Inicialize o Cognito Identity Service Provider
const cognito = new AWS.CognitoIdentityServiceProvider();

function generateSecretHash(username, clientId, clientSecret) {
    return crypto.createHmac('SHA256', clientSecret)
                 .update(username + clientId)
                 .digest('base64');
  }

const validar = async (user,code) => {
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const params = {
    ClientId: clientID, // Substitua pelo seu ClientId do App no User Pool
    SecretHash: generateSecretHash(user,clientID,clientSecret),
    Username: user, // O nome de usuário (email)
    ConfirmationCode: code, // O código de confirmação que o usuário recebeu por e-mail
  };
 try {
    const data = await cognito.confirmSignUp(params).promise();
    return data; // Retorne os dados para tratamento posterior
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error; // Lance o erro para tratamento na camada de chamada
  }
};

module.exports = { validar };
































