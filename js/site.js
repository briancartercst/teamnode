//define global config and variables
var config;
var teamnode = {};

init();


$( document ).ready(function() {
	$('.header').html(header());
	$('.footer').html(footer());
	footerScript();
});

function init() {
	//preload logo to avoid flashing
	logoImage = new Image();
	logoImage.src = "./img/logo.png";
	
	initInfo();
	
	$('head').append(headElement());
}

function initInfo() {
	console.log("in initinfo");
	if(localStorage.sitename == null)
	{
		var data = {};
		$.ajax({ url: 'api/v1/info', 
			dataType: 'json', contentType: 'application/json',
			type: "GET",
			data: JSON.stringify(data),
			cache: true,
			error: function (jqxhr, textStatus, errorThrown) {
				console.log('error', textStatus, '//', errorThrown);
			},
			success: function (data) {
				//console.log('data: ' + JSON.stringify(data));				
				teamnode["info"] = data;
			},
			fail: function( jqxhr, textStatus, error ) {
				var err = textStatus + ", " + error;
				console.log( "Request Failed: " + err );
			}			
		});
	}
	
	var teamid = getQueryVariable("teamid");
	//console.log("teamid: " + teamid);
	if(teamid != null)
	{
		if(teamid != localStorage["teamid"])
		{
			localStorage["team.id"] = teamid;
			localStorage["team.shorthand"] = teamid;
			localStorage["team.background"] = teamid;
			localStorage["team.fontcolor"] = teamid;
			localStorage["team.contactname"] = teamid;
			localStorage["team.contactemail"] = teamid;
			localStorage["team.listbackground"] = teamid;
			localStorage["team.listfontcolor"] = teamid;
		}
	}
	
	if(window.location.pathname != "/" && localStorage.teamid == null)
	{
		window.location = window.location.protocol + "//" + window.location.host;
	}
}	
	

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
		'      <a class="navbar-brand" href="/">';html+=localStorage.sitename;html+='</a>' +
		'    </div>' +
		'    <div class="navbar-collapse collapse" style="height: 1px;">' +
		'      <ul class="nav navbar-nav">' +
		'      </ul>' +
		'    </div>' +
		'  </div>' +
		'</div>';
		
		var data = {teamid:localStorage.teamid};
		$.ajax({ url: 'api/v1/pages', 
			dataType: 'json', contentType: 'application/json',
			type: "POST",
			data: JSON.stringify(data), 
			error: function (jqxhr, textStatus, errorThrown) {
				console.log('error', textStatus, '//', errorThrown);
			},
			success: function (data) {
				//console.log('data: ' + JSON.stringify(data));	
				var html = '';
				$.each(data.pages, function (i, value) {
					//console.log('value: ' + JSON.stringify(value));
					html  += '        <li><a href="'+ value.url +'">'+ value.name +'</a></li>';
				});

				$('.nav').html(html);
			},
			fail: function( jqxhr, textStatus, error ) {
			}			
		});	
		
	return html;
}

function footer() {
	var html = 
      '<div class="row">' +
      '  <div class="col-sm-12">' +
      '      <p>' +
      '        &copy; ' + localStorage.sitename;
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
    $.getScript = function(url, callback, cache)
    {
        $.ajax({
                type: "GET",
                url: url,
                success: callback,
                dataType: "script",
                cache: cache
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