import { compileStrFunction, unCompileStrFunction } from '@/utils/storeageCompile';


export default {
  get loginUser() {
    const localUserStr = window.localStorage.getItem('user');
    return localUserStr ? JSON.parse(unCompileStrFunction(localUserStr)) : null;
  },
  set loginUser(value: any) {
    value ? window.localStorage.setItem('user', compileStrFunction(JSON.stringify(value))) : window.localStorage.removeItem('user');
  },
  get serverUser() {
    const localUserStr = window.sessionStorage.getItem('user');
    return localUserStr ? JSON.parse(unCompileStrFunction(localUserStr)) : null;
  },
  set serverUser(value: any) {
    value ? window.sessionStorage.setItem('user', compileStrFunction(JSON.stringify(value))) : window.sessionStorage.removeItem('user');
  }
};