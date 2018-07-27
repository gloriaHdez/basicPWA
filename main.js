	//registro del Service worker
	if('serviceWorker' in navigator)
	{
		console.log("SI puedes usar los serviceWorker en tu navegador");
		//registar un service worker 
		navigator.serviceWorker.register('./sw.js')
								.then(res=> console.log("serviceWorker cargado correctamente",res))
								.catch(err => console.log("serviceWorker no se ha podido registar", err));
	}else{

		console.log("NO puedes usar los serviceWorker en tu navegador");
	}


	//Scroll suavizado
	$(document).ready(function(){

		$("#menu a").click(function(e){
			e.preventDefault();
			//console.log(  $("#footer").offset().top );

			$("html, body").animate({
				scrollTop: $($(this).attr('href')).offset().top
			});
			return false;
	     });
		
	});