

// --- HTML side of things --------------------

<a class="maxpreps-widget-link" data-width="1200" data-height="900" data-type="tournament" data-member-id="5c84e3b8-99be-42ac-a048-e011fc2d312e" data-allow-scrollbar="true" href="http://www.maxpreps.com/tournament/view.aspx?tournamentid=f7904f71-a13e-e411-b4d2-002655e6c45a&ssid=f9bafe0d-45cb-4693-aa16-f8766dc2f9fb&bracketid=3e8b7250-3e40-e411-b4d2-002655e6c45a">2014-15 IHSAA Class 2A Boys Soccer State Tournament Sect. 30: Floyd Central</a>
<script type="text/javascript">
    (function(d) {
        var mp = d.createElement('script'),
            h = d.getElementsByTagName('head')[0];
        mp.type = 'text/javascript';
        mp.async = true;
        mp.src = 'http://www.maxpreps.com/includes/js/widget/widget.compressed.js';
        h.appendChild(mp);
    })(document);
</script>


// --- JS side of things --- JS created on server ------------------


// java -jar "C:\Program Files (x86)\yuicompressor-2.4.7\build\yuicompressor-2.4.7.jar" --charset UTF-8 -v "C:\projects\web\includes\js\widget\widget.js" > "C:\projects\web\includes\js\widget\widget.compressed.js"

/*
 * jQuery JavaScript Library v1.6.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 
	Modified so that it won't conflict with any websites standard jQuery framework.
 */
 
 
(function( window, undefined ) {

	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document;
	
	var MPJQuery = (function() {

		var MPJQuery = function( selector, context ) 
		{
			// The MPJQuery object is actually just the init constructor 'enhanced'
			return new MPJQuery.fn.init();
		},
		
		// The ready event handler
		DOMContentLoaded,

		// Save a reference to some core methods
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty;

		// [[Class]] -> type pairs
		class2type = {};

		
		// Cleanup functions for the document ready method
		if ( document.addEventListener ) 
		{
			DOMContentLoaded = function() 
			{
				document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
				MPJQuery.ready();
			};

		} 
		else if ( document.attachEvent ) 
		{
			DOMContentLoaded = function() 
			{
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( document.readyState === "complete" ) 
				{
					document.detachEvent( "onreadystatechange", DOMContentLoaded );
					MPJQuery.ready();
				}
			};
		}
		
		MPJQuery.fn = MPJQuery.prototype = {
			constructor: MPJQuery,
			
			init: function() 
			{
				MPJQuery.bindReady();
			}
		};		

		// Give the init function the MPJQuery prototype for later instantiation
		//MPJQuery.fn.init.prototype = MPJQuery.fn;

		MPJQuery.extend = MPJQuery.fn.extend = function() 
		{
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !MPJQuery.isFunction(target) ) {
				target = {};
			}

			// extend MPJQuery itself if only one argument is passed
			if ( length === i ) {
				target = this;
				--i;
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( MPJQuery.isPlainObject(copy) || (copyIsArray = MPJQuery.isArray(copy)) ) ) {
							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && MPJQuery.isArray(src) ? src : [];

							} else {
								clone = src && MPJQuery.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = MPJQuery.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};

		MPJQuery.extend({

			// Is the DOM ready to be used? Set to true once it occurs.
			isReady: false,

			// A counter to track how many items to wait for before
			// the ready event fires. See #6781
			readyWait: 1,

			// Handle when the DOM is ready
			ready: function(wait) {
				// Either a released hold or an DOMready/load event and not yet ready
				if ((wait === true && !(--MPJQuery.readyWait)) 
					|| (wait !== true && !MPJQuery.isReady)) 
				{
					// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
					if ( !document.body ) 
					{
						return setTimeout( MPJQuery.ready, 1 );
					}

					// Remember that the DOM is ready
					MPJQuery.isReady = true;

					// If a normal DOM Ready event fired, decrement, and wait if need be
					if (wait !== true 
						&& --MPJQuery.readyWait > 0) 
					{
						return;
					}

					MPJQuery.createWidgets();
				}
			},

			bindReady: function() 
			{
				// Catch cases where $(document).ready() is called after the
				// browser event has already occurred.
				if ( document.readyState === "complete" ) {
					// Handle it asynchronously to allow scripts the opportunity to delay ready
					return setTimeout( MPJQuery.ready, 1 );
				}

				// Mozilla, Opera and webkit nightlies currently support this event
				if ( document.addEventListener ) {
					// Use the handy event callback
					document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

					// A fallback to window.onload, that will always work
					window.addEventListener( "load", MPJQuery.ready, false );

				// If IE event model is used
				} else if ( document.attachEvent ) {
					// ensure firing before onload,
					// maybe late but safe also for iframes
					document.attachEvent( "onreadystatechange", DOMContentLoaded );

					// A fallback to window.onload, that will always work
					window.attachEvent( "onload", MPJQuery.ready );

					// If IE and not a frame
					// continually check to see if the document is ready
					var toplevel = false;

					try {
						toplevel = window.frameElement == null;
					} catch(e) {}

					if ( document.documentElement.doScroll && toplevel ) {
						doScrollCheck();
					}
				}
			},

			// See test/unit/core.js for details concerning isFunction.
			// Since version 1.3, DOM methods and functions like alert
			// aren't supported. They return false on IE (#2968).
			isFunction: function( obj ) 
			{
				return MPJQuery.type(obj) === "function";
			},

			isArray: Array.isArray || function( obj ) 
			{
				return MPJQuery.type(obj) === "array";
			},

			// A crude way of determining if an object is a window
			isWindow: function( obj ) 
			{
				return obj && typeof obj === "object" && "setInterval" in obj;
			},

			isNaN: function( obj ) 
			{
				return obj == null || !rdigit.test( obj ) || isNaN( obj );
			},

			type: function( obj ) 
			{
				return obj == null ?
					String( obj ) :
					class2type[ toString.call(obj) ] || "object";
			},

			isPlainObject: function( obj ) {
				// Must be an Object.
				// Because of IE, we also have to check the presence of the constructor property.
				// Make sure that DOM nodes and window objects don't pass through, as well
				if ( !obj || MPJQuery.type(obj) !== "object" || obj.nodeType || MPJQuery.isWindow( obj ) ) {
					return false;
				}

				// Not own constructor property must be Object
				if ( obj.constructor &&
					!hasOwn.call(obj, "constructor") &&
					!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
					return false;
				}

				// Own properties are enumerated firstly, so to speed up,
				// if last one is own, then all properties are own.

				var key;
				for ( key in obj ) {}

				return key === undefined || hasOwn.call( obj, key );
			},
			
			createWidgets: function()
			{
				var widgetAnchorElements = [];
						
				if(document.getElementsByClassName != null) // for browsers with getElementsByClassName support
				{
					// turn the node list into an array
					var tempItems = document.getElementsByClassName("maxpreps-widget-link");
					for(var i = tempItems.length - 1; i >= 0; i--)
					{
						widgetAnchorElements.push(tempItems[i]);
					}
				}
				else // for browsers with no getElementsByClassName support
				{
					var elements = document.getElementsByTagName('*'),
					className = " maxpreps-widget-link ";
					
					for (var i = elements.length - 1; i >= 0; i--) 
					{
						if((' ' + elements[i].className + ' ').indexOf(className) > -1) 
						{
							widgetAnchorElements.push(elements[i]);
						}
					}
				}
				
				// define params outside of for loop to prevent loop from needed to create var's each iteration
				var iframe = null,
				src = null,
				params = null,
				param = null,
				width = null,
				memberId = null,
				host = null,
				re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
				
				for(var i = widgetAnchorElements.length - 1; i >= 0; i--)
				{
					if(widgetAnchorElements[i].nodeName !== "A")
					{
						continue;
					}
					
					src = widgetAnchorElements[i].getAttribute("href", 2),
					host = src.match(re)[1].toString();
					
					width = widgetAnchorElements[i].getAttribute("data-width");
					memberId = widgetAnchorElements[i].getAttribute("data-member-id");
					
					// Do some validation. Don't show widget if they've tweaked the anchor tag.
					if(widgetAnchorElements[i].getAttribute("rel") !== "nofollow"
						&& width != null
						&& width != ""
						&& memberId != null
						&& memberId != ""
						&& src != null
						&& host.indexOf(".maxpreps.com") != -1)
					{				
						iframe = document.createElement("iframe");
											
						// get the query params
						params = [];
						param = widgetAnchorElements[i].getAttribute("data-header-size");
						if(param != null)
						{
							params.push("header-size=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-content-size");
						if(param != null)
						{
							params.push("content-size=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-content-color");
						if(param != null)
						{
							params.push("content-color=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-content-box-background-color");
						if(param != null)
						{
							params.push("content-box-background-color=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-link-color");
						if(param != null)
						{
							params.push("link-color=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-font");
						if(param != null)
						{
							params.push("font=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-width");
						if(param != null)
						{
							if(param.indexOf("%") != -1)
							{
								iframe.style.width = param;
								
								// gets the initial width
								param = widgetAnchorElements[i].parentNode.scrollWidth * (parseFloat(param.replace("%", "")) / 100);
							}
							else
							{
								iframe.style.width = param + "px";
							}
							
							params.push("width=" + param);				
						}
						
						param = widgetAnchorElements[i].getAttribute("data-height");
						if(param != null)
						{
							if(param.indexOf("%") != -1)
							{
								iframe.style.height = param;
								
								// gets the initial height
								param = widgetAnchorElements[i].parentNode.scrollHeight * (parseFloat(param.replace("%", "")) / 100);
							}
							else
							{
								iframe.style.height = param + "px";
							}
							
							params.push("height=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-item-count");
						if(param != null)
						{
							params.push("itemcount=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-member-id");
						if(param != null)
						{
							params.push("memeberid=" + param);
						}
						
						param = widgetAnchorElements[i].getAttribute("data-include-header");
						if(param != null)
						{
							params.push("includeheader=" + param);
						}
						
						
						param = widgetAnchorElements[i].getAttribute("data-allow-scrollbar");
						if(param != null
							&& param === "true")
						{
							params.push("allow-scrollbar=" + param);
							iframe.style.overflow = "auto";
						}
						else
						{
							iframe.style.overflow = "hidden";
							iframe.scrolling = "no";
						}
						
						if(window.location != null)
						{
							params.push("ref=" + encodeURIComponent(window.location.href));
						}
						
						iframe.frameBorder = 0;
						iframe.className = "maxpreps-widget";
						iframe.allowTransparency = true;
						
						// deal with src. (pass 2 so ie doesn't normalize href value)
						src = src.substr(src.indexOf("?"));
						
						param = widgetAnchorElements[i].getAttribute("data-type");
						
						// for backward compatibility
						if(param == null)
						{
							param = widgetAnchorElements[i].getAttribute("data-calendar");
							
							if(param != null
								&& param === "true")
							{
								param = "calendar";
							}
							else
							{
								param = "wall";
							}
						}
						
						if(param === "tournament")
						{
							src = "http://" + host + "/widgets/tournament.aspx" + src;
						}
						else if(param === "calendar")
						{
						    if(src.indexOf("gendersport") != -1)
						    {
							    src = "http://" + host + "/widgets/team_calendar.aspx" + src;
						    }
						    else
						    {
							    src = "http://" + host + "/widgets/school_calendar.aspx" + src;
						    }
						}
						else if(param === "wall")
						{
						    if(src.indexOf("gendersport") != -1)
						    {
							    src = "http://" + host + "/widgets/team_wall.aspx" + src;
						    }
						    else
						    {
							    src = "http://" + host + "/widgets/school_wall.aspx" + src;
						    }
						}
						
						iframe.src = src + "&" + params.join("&");
						
						widgetAnchorElements[i].parentNode.insertBefore(iframe, widgetAnchorElements[i]);
						widgetAnchorElements[i].parentNode.removeChild(widgetAnchorElements[i]);
					}
				}
			}
		});

		// All MPJQuery objects should point back to these
		rootMPJQuery = MPJQuery(document);

		// The DOM ready check for Internet Explorer
		function doScrollCheck() 
		{
			if (MPJQuery.isReady ) 
			{
				return;
			}

			try 
			{
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} 
			catch(e) 
			{
				setTimeout( doScrollCheck, 1);
				return;
			}

			// and execute any waiting functions
			MPJQuery.ready();
		}

		return MPJQuery;

	})();
})(window);