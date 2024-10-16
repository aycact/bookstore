const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user.id,
    role: user.role,
    identityIsVerified: user.identity_is_verified
  }
}

module.exports = createTokenUser
