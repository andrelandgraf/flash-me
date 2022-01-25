enum GithubAuthResState {
  codeRequired = 'code_required',
  verifyError = 'verify_error',
  nameRequired = 'name_required',
  emailRequired = 'email_required',
  internalError = 'internal_error',
  signInSuccess = 'signIn_success',
  signUpSuccess = 'signUp_success',
}

enum GithubAuthTokenResState {
  codeRequired = 'code_required',
  verifyError = 'verify_error',
  internalError = 'internal_error',
  success = 'success',
}

export { GithubAuthResState, GithubAuthTokenResState };
