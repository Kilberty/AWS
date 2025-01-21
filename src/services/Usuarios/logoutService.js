const AWS = require('aws-sdk');

// Inicialize o Cognito Identity Service Provider
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * Serviço de logout
 * @param {string} accessToken - O token de acesso do usuário
 * @returns {object} - Mensagem de sucesso ou erro
 */
const logout = async (accessToken) => {
  if (!accessToken) {
    throw new Error('AccessToken é obrigatório para realizar o logout.');
  }

  const params = {
    AccessToken: accessToken, // Token de acesso do usuário
  };

  try {
    // Invalida a sessão do usuário no Cognito
    await cognito.globalSignOut(params).promise();
    console.log('Usuário desconectado com sucesso.');
    return { status: 200, message: 'Logout realizado com sucesso.' };
  } catch (error) {
    console.error('Erro ao realizar logout:', error);
    throw { status: 500, message: 'Erro ao realizar logout.', details: error.message };
  }
};

module.exports = { logout };