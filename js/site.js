

//teamnode init is fired first

$( document ).ready(function() {
	if(window.location.pathname != "/" && getQueryVariable("teamid") == null)
	{
		window.location = window.location.protocol + "//" + window.location.host;
	}	
	
	$('.header').html(header());
	$('.footer').html(footer());
	footerScript();
});

var teamnode = (function () {	
	var init = function() {
		//preload logo to avoid flashing
		logoImage = new Image();
		logoImage.src = "./img/logo.png";
		$('head').append(headElement());
	}

	var fetchInfo = function() {
		console.log("in fetchInfo");

		return $.ajax({ url: 'api/v1/info', 
			dataType: 'json', contentType: 'application/json',
			type: "GET",
			cache: true
		});
	}
	
	var fetchTeams = function(data) {
		console.log("in fetchTeams");
		
		return $.ajax({ url: 'api/v1/teams', 
			dataType: 'json', contentType: 'application/json',
			type: "GET",
			cache: true,
			data: data			
		});
	}

	var fetchPages = function(data) {
		console.log("in fetchPages - data = " + JSON.stringify(data));
		
		return $.ajax({ url: 'api/v1/pages', 
			dataType: 'json', contentType: 'application/json',
			type: "GET",
			cache: true,
			data: data			
		});
	}			
	
	

	//Public functions add here; Private otherwise
	return {
		init: init,
		fetchInfo: fetchInfo,
		fetchTeams: fetchTeams,
		fetchPages: fetchPages,
	};	
	
})();

teamnode.init();

function headElement() {
    var html =
	'<meta charset="utf-8">' +
	'<meta name="viewport" content="width=device-width, initial-scale=1">' +
	'<link rel="stylesheet" href="./css/bootstrap.min.css">' +
	'<link href="./css/site.css" rel="stylesheet">' +
	'<link href="./css/bootstrap-responsive.css" rel="stylesheet">' +
	'<link rel="stylesheet" href="./font-awesome/css/font-awesome.css">' +	
	'<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->' +
	'<!--[if lt IE 9]>' +
	'<script src="./js/html5shiv.js"></script>' +
	'<![endif]-->' +
	'<!-- Fav and touch icons -->' +
	'<link rel="apple-touch-icon-precomposed" sizes="144x144" href="./ico/apple-touch-icon-144-precomposed.png">' +
	'<link rel="apple-touch-icon-precomposed" sizes="114x114" href="./ico/apple-touch-icon-114-precomposed.png">' +
	'<link rel="apple-touch-icon-precomposed" sizes="72x72" href="./ico/apple-touch-icon-72-precomposed.png">' +
	'<link rel="apple-touch-icon-precomposed" href="./ico/apple-touch-icon-57-precomposed.png">' +
	'<link rel="shortcut icon" href="./ico/favicon.ico">';

    return html;
}

function header() {
	var html = 
		'<div class="navbar navbar-inverse navbar-static-top hidden-print">' +
		'  <div class="container">' +
		'    <div class="navbar-header">' +
		'      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">' +
		'        <span class="sr-only">Toggle navigation</span>' +
		'        <i class="fa fa-bars fa-lg"></i>' +
		'      </button>' +
		'      <a class="navbar-brand" href="/">';html+=localStorage["infositename"];html+='</a>' +
		'    </div>' +
		'    <div class="navbar-collapse collapse" style="height: 1px;">' +
		'      <ul class="nav navbar-nav">' +
		'      </ul>' +
		'    </div>' +
		'  </div>' +
		'</div>';
	return html;
}

function footer() {
	var html = 
      '<div class="row">' +
      '  <div class="col-sm-12">' +
      '      <p>' +
      '        &copy; <span class="sitename"></span>';
      '      </p> ' + 
      '  </div>';

	return html;
}

function footerScript() {
/*	
	$.getScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js', function()
	{
	    //do something after script loaded
	}, true);

*/
	var newscript = document.createElement("script");
	newscript.async = true;
	newscript.src = document.location.protocol + "./js/bootstrap.min.js";
	var s0 = document.getElementsByTagName('script')[0];
	s0.parentNode.insertBefore(newscript, s0);		
}

function siteConfig() {

}

//getScript refactor to include caching
(function () {
    $.getScript = function(url, callback, cacherequest)
    {
        $.ajax({
                type: "GET",
                url: url,
                success: callback,
                dataType: "script",
                cache: cacherequest
        });
    };
})();

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(null);
}

