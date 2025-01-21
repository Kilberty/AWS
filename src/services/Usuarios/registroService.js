const AWS = require('aws-sdk');
const crypto = require('crypto')

// Inicialize o Cognito Identity Service Provider
const cognito = new AWS.CognitoIdentityServiceProvider();


function generateSecretHash(username, clientId, clientSecret) {
    return crypto.createHmac('SHA256', clientSecret)
                 .update(username + clientId)
                 .digest('base64');
  }

const registrar = async (user, pwd, userDB, target) => {
  const clientId = process.env.CLIENT_ID;  
  const clientSecret = process.env.CLIENT_SECRET;
  
  const params = {
    ClientId: clientId, // Substitua pelo seu ClientId do App no User Pool
    SecretHash: generateSecretHash(user,clientId,clientSecret),
    Username: user,
    Password: pwd,
    UserAttributes: [
      {
        Name: 'email',
        Value: user, // O email do usuário
      },
      {
        Name: 'custom:database', // Atributo personalizado
        Value: target, // O banco de dados ou outro valor personalizado
      },
      {
        Name: 'custom:user_database',
        Value: userDB
      }
    ],
  };

  try {
    const data = await cognito.signUp(params).promise();
    return data; // Retorne os dados para tratamento posterior
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error; // Lance o erro para tratamento na camada de chamada
  }
};

module.exports = { registrar };
