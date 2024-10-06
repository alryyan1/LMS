import { io } from 'socket.io-client';
import { host } from './pages/constants';

// "undefined" means the URL will be computed from the `window.location` object
// const URL =  'http://localhost:3000';
const URL =  `http://${host}:3000`;

export const socket = io(URL,{autoConnect:true});