import axios from 'axios';

const api = axios.create({
    //Ao fazer diversas requisições teste na api acabei sendo bloqueado pelo CORS, que pelo que li é uma política de acesso que impede ataques em massa via acessos múltiplos. Uma forma que achei para "driblar" o CORS é simulando que o acesso está sendo feito de outro local.
    // https://cors-anywhere.herokuapp.com/corsdemo
    baseURL: 'https://cors-anywhere.herokuapp.com/https://api.github.com',
});

export default api;