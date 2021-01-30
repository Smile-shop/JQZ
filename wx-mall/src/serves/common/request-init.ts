import {getHeaders, postHeaders, postFileHeaders} from './headers';

export const getRequestInit: RequestInit = {
  method: 'GET',
  headers: getHeaders,
  credentials: 'include',
  mode: 'cors',
};

export const postRequestInit: RequestInit = {
  method: 'POST',
  headers: postHeaders,
  credentials: 'include',
  mode: 'cors',
};

export const postFileRequestInit: RequestInit = {
  method: 'POST',
  headers: postFileHeaders,
  credentials: 'include',
  mode: 'cors',
};
