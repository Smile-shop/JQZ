import {unCompileStrFunction} from './storeageCompile';

export function getSessionStorage() {
  const superAPPPhonePermission = window.sessionStorage.getItem('superAPPPhonePermission');
  const superAPPPadPermission = window.sessionStorage.getItem('superAPPPadPermission');
  const superAPPTVPermission = window.sessionStorage.getItem('superAPPTVPermission');
  const superCRMPermission = window.sessionStorage.getItem('superCRMPermission');
  const superMKTPermission = window.sessionStorage.getItem('superMKTPermission');
  const user = window.sessionStorage.getItem('user');

  return {
    superAPPPhonePermission: superAPPPhonePermission ? JSON.parse(superAPPPhonePermission) : null,
    superAPPPadPermission: superAPPPadPermission ? JSON.parse(superAPPPadPermission) : null,
    superAPPTVPermission: superAPPTVPermission ? JSON.parse(superAPPTVPermission) : null,
    superCRMPermission: superCRMPermission ? JSON.parse(superCRMPermission) : null,
    superMKTPermission: superMKTPermission ? JSON.parse(superMKTPermission) : null,
    user: user ? JSON.parse(unCompileStrFunction(user)) : null,
  }
}

export function getLocalStorage() {
  const user = window.localStorage.getItem('user');

  return {
    user: user ? JSON.parse(unCompileStrFunction(user)) : null,
  }
}