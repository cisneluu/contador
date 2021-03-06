//Definir un arreglo con las rutas del sitio a guardar en el cache
const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.development.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.development.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "/style.css",
    "/components/Contador.js"
]


//Definimos el nombre del cache
const CACHE_NAME = "v1_cache_contador_react";

//Trabajando con el primer evento del service worker llamado install, el cual es la primera parte del ciclo de vida de un service worker, que es cuando se registra se instala y lo que va a hacer al instalarse es chacear todas las rutas para que ahora el service worker me provea de toda esa información y ya no tenga que estar haciendo peticiones a internet a cada rato.

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache
                .addAll(CACHE_ELEMENTS)
                .then(() => {
                    self.skipWaiting();
                })
                .catch(console.log);
        })
    );
});


//el metodo keys devuelve todas las llaves en caso de que tengamos más de un cache instalado.
//Trabajando con el siguiente evento del service worker llamado activate, en el que se define que hacer cuando se activa el service worker.

//El método keys devuelve todas las llaves en caso de que tengamos más de un cache instalado.
self.addEventListener("activate", (e) => {
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map(cacheName => {
                return (
                    cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName)
                );
            }))
        })
        //Una vez que ya se activó todo mi caché y ya se está utilizando hay que reclamarlo
        .then(() => self.clients.claim())
    );
});

//Trabajando con el primer evento del service worker llamado install, el cual es la primera parte del ciclo de vida de un service worker, que es cuando se registra se instala y lo que va a hacer al instalarse es chacear todas las rutas para que ahora el service worker me provea de toda esa información y ya no tenga que estar haciendo peticiones a internet a cada rato.
self.addEventListener("fetch", (e) => {
    //Lo que haremos es comparar si es que ya existe el contenido de la ruta en el cache y si no lo agregamos al cache.
    e.respondWith(
        caches.match(e.request).then((res) => {
            if(res) {
                return res;
            }
            return fetch(e.request);
        })
    );
});