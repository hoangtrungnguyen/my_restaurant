export default {
  SET_USER(state, user) {
    state.authenticated = !!user
    state.user = {
      email: user ? user.email : null,
      displayName: user ? user.displayName : null,
      photoURL: user ? user.photoURL : null,
    }
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  }
}
