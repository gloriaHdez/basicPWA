/*asignar un nombre y versión al cache*/
const CACHE_NAME = 'v1_cache_victor_robles';
  
/* Ficheros a cachear en la aplicación*/
urlsToCache = [
  '../',
  '../css/styles.css',
  '../js/main.js',
  '../img/favicon.png',
  '../img/1.png',
  '../img/2.png',
  '../img/3.png',
  '../img/4.png',
  '../img/5.png',
  '../img/6.png',
  '../img/facebook.png',
  '../img/instagram.png',
  '../img/twitter.png'
];
 //self  es la variable del sw
/*durante la fase de instalación, generalmente se almacena en caché los activos estáticos*/
self.addEventListener('install', e => {   
  e.waitUntil(
    caches.open(CACHE_NAME)  
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())  //la respuesta se puede ignorar de forma segura
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
});
 
/*una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión, 
este evento tambien funciona cuando se actualiza el sw, pues se vuelve a correr instal*/
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]
 
  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            /*Eliminamos lo que ya no se necesita en cache,*/
            if (cacheWhitelist.indexOf(cacheName) === -1) { //si rogramaticamente ya no se encuentran, se eliminan 
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
});
 
/*cuando el navegador recupera una url*/
self.addEventListener('fetch', e => {
  /*Responder ya sea con el objeto en caché o continuar y buscar la url real*/
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
});

/*Si deseamos almacenar en caché solicitudes nuevas de forma acumulativa, 
podemos hacerlo administrando la respuesta de la solicitud de fetch 
y luego agregándola al caché, como se muestra a continuación.*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});



/*Metodo poco mas robusto.*/
/*s
	self.addEventListener('fetch', event=>{
		event.respondWith(
			caches.match(event.request)
				  .then(res=>{
				  	//devuelvo datos desde cache
				 if(res) 
				 	return res;
				 const request  = event.request.clone(); //un stream de datos no puede ser consumido mas de una vez, por ello se clona
				 return  fetch(request)
				 		 .then(response =>{
				 		 	if(!response || response.status!=200){

				 		 		return response;
				 		 	}

				 		 	//a este punto, abrimos el catch y no guardamos, 
				 		 	const responseToCache = response.clone();
				 		 	caches.open(CACHE_NAME)
				 		 		  .then (cache =>{
				 		 		  	cache.put(event.request, responseToCache);
				 		 		  })
				 		 		  return response;
				 		 })

				  })

			);

	});*/