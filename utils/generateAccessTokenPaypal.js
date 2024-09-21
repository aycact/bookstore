const generateAccessTokenPaypal = async () => {
  require('dotenv').config()
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env
  
    // mã hóa client id và client secret
  const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const request = await fetch(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        response_type: 'id_token',
        intent: 'sdk_init',
      }),
    }
  )
  const json = await request.json()
  return json.access_token
}

module.exports = generateAccessTokenPaypal