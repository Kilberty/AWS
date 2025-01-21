const AWS = require('aws-sdk');
const crypto = require('crypto');

// Inicialize o Cognito Identity Service Provider
const cognito = new AWS.CognitoIdentityServiceProvider();

// Função para gerar o SecretHash
function generateSecretHash(username, clientId, clientSecret) {
    return crypto.createHmac('SHA256', clientSecret)
                 .update(username + clientId)
                 .digest('base64');
}

// Função para autenticar o usuário
const autenticar = async (user, pwd) => {
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  
  // Verifique se o clientSecret está definido corretamente
  if (!clientSecret) {
    throw new Error('ClientSecret não está definido. Verifique suas variáveis de ambiente.');
  }
  
  // Parâmetros da autenticação
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH', // Fluxo correto para usar o SecretHash
    ClientId: clientID,
    AuthParameters: {
      USERNAME: user,
      PASSWORD: pwd,
      SECRET_HASH: generateSecretHash(user, clientID, clientSecret) // Enviando o SecretHash corretamente
    },
  };

  try {
    const data = await cognito.initiateAuth(params).promise();
    console.log('Usuário autenticado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    throw error;
  }
};

module.exports = { autenticar };
