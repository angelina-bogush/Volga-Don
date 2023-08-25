import {addCard, createCardCatalog, createCardNews, newsContainerMain, catalogContainerMain} from './admin-main.js';
import { newsContainer } from './admin-news.js';
import { catalogContainer} from './admin-catalog.js';
import { baseUrl, checkAnswer } from './utils.js';

export const auth = () => {
  return fetch(`${baseUrl}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "admin",
      password: "123",
    }),
  })
  .then(checkAnswer)
  .then((data) => {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);})
}

export const refresh = () => {
  return fetch(`${baseUrl}/auth/login/refresh/`,{
  method: "POST",
  headers:{
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem('refresh')}`
  },
  body: JSON.stringify({
    username: "admin",
    password: "123",
    refresh: localStorage.getItem('refresh')
  })
})
.then(checkAnswer)
.then(data => localStorage.setItem('access', data.access))
}

setInterval(auth, 86400000)
setInterval(() => {                   //обновление токена
  refresh();
}, 30 * 60 * 1000);



// вывод на главную страницу админа первых 3х новостей
export const renderAdminNewsMain = () => {
    return fetch(`${baseUrl}/articles/`)
    .then(checkAnswer);
    }
//вывод на страницу новостей
export const renderAdminNews = () => {
  return fetch(`${baseUrl}/articles/`)
  .then(checkAnswer)
  .then(data =>  {
    data.forEach((article) => {
    addCard(article, newsContainer, createCardNews)
  })});
}
//вывод каталог главная админ
export const renderAdminCatalogMain = () => {
  return fetch(`${baseUrl}/products/`)
  .then(checkAnswer)
}
//вывод на страницу каталог
export const renderAdminCatalog = () => {
  return fetch(`${baseUrl}/products/`)
  .then(checkAnswer)
  .then(data =>  {
    data.forEach((item) => {
    addCard(item, catalogContainer, createCardCatalog)
  })});
}

document.addEventListener("DOMContentLoaded", function(){

if (window.location.pathname.endsWith('admin-news.html')){
  renderAdminNews()
}
if (window.location.pathname.endsWith('admin-catalog.html')){
  renderAdminCatalog();
}
})


export const getAdminProducts = () => {
  return fetch(`${baseUrl}/products/admin/list/`,{
  headers:{
    "Authorization": `Bearer ${localStorage.getItem('access')}`,
    "Content-Type": "application/json"
  }
  })
  .then(checkAnswer)
}

export const getAdminNews = () => {
  return fetch(`${baseUrl}/articles/admin/list/`,{
  headers:{
    "Authorization": `Bearer ${localStorage.getItem('access')}`,
    "Content-Type": "application/json"
  }
  })
  .then(checkAnswer)
}