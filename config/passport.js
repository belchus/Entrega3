const LocalStrategy = require('passport-local').Strategy
const bcript = require('bcryptjs')

function initialize(passport, getUserByEmail, getUserById) {
  const auth = async (email, password, done) => {
    const usuario = await getUserByEmail(email)
    if (usuario == null) {
      return done(null, false, { message: "no existe un usuario registrado con ese email." })
    }
    try {
      if (await bcript.compare(password, usuario.password)) {
        return done(null, usuario)
      } else {
        return done(null, false, { message: "contraseña incorrecta" })
      }
    } catch (err) {
      return done(err)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, auth))
  passport.serializeUser((usuario, done) => { done(null, usuario.id) })
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id))
  })
}

module.exports = initialize