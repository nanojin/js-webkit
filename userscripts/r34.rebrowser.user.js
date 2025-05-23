// ==UserScript==
// @name         R34 Img Rebrowser
// @namespace    http://tampermonkey.net/
// @version      0.0.002.9
// @description  Restructures and improves browsing on Rule34.XXX
// @author       Nano
// @match        https://rule34.xxx/index.php?*id=*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=rule34.xxx
// @require      https://github.com/nanojin/js-webkit/raw/refs/heads/master/dist/webkit-lib.user.js
// @grant        none
// ==/UserScript==

const site = {};

// Helper to parse query string into an object
{
	function parseQuery(search) {
		const params = {};
		search.replace(/^[^?]*\?/, '').split('&').forEach(pair => {
			if (!pair) return;
			const [key, value] = pair.split('=');
			params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
		});
		return params;
	}
	const query = parseQuery(location.search);

	site.interface = {
        post: {
            is_post: query.page === 'post',
            view: query.page === 'post' && query.s === 'view' && !!query.id,
            list: query.page === 'post' && query.s === 'list',
            new_post: query.page === 'post' && query.s === 'add',
            new_video: query.page === 'post' && query.s === 'addVideo',
            favorites: query.page === 'favorites' && query.s === 'view',
        },
        tags: {
            list: query.page === 'tags' && query.s === 'list',
        },
        comments: {
            list: query.page === 'comment' && query.s === 'list',
        },
        wiki: {
            list: query.page === 'wiki' && query.s === 'list',
        },
        alias: {
            list: query.page === 'alias' && query.s === 'list',
        },
        artist: {
            list: query.page === 'artist' && query.s === 'list',
        },
        pool: {
            list: query.page === 'pool' && query.s === 'list',
            show: query.page === 'pool' && query.s === 'show',
        },
        forum: {
            list: query.page === 'forum' && query.s === 'list',
        },
        top100: {
            list: query.page === 'forum' && query.s === 'list', // If this is different, adjust as needed
        },
        help: {
            index: query.page === 'help',
            topic: query.page === 'help' && 'topic' in query,
        },
        user: {
            home: query.page === 'account' && query.s === 'home',
        },
    };
};

/* Function structure
 * set_global_const(prop, value)
 * prop: string - The name of the property to set on the global object (window)
 * value: any - The value to set for the property. If it's a function, it will be used as a getter.
 * If it's an object, it will be set directly as the value.
*/
function set_global_const(target=window, prop, value) {
	{
		Object.defineProperty(target, prop, {
			get: typeof value === 'function' ? value : function() { return value; },
			configurable: false,
			enumerable: true,
		});
	}
	return;
	const obj = target;
	const getter_fn = (typeof value === 'function') ? value : undefined;

	// if (obj.hasOwnProperty(prop)) {
	// 	if (typeof obj[prop] === 'object') {
	// 		Object.assign(obj[prop], value);
	// 	} else {
	// 		obj[prop] = value;
	// 	}
	// } else {
	{
		if (getter_fn) {
			Object.defineProperty(obj, prop, {
				get: getter_fn,
				configurable: false,
				writable: false,
				enumerable: true,
			});
		}
		else {
			Object.defineProperty(obj, prop, {
				value: value,
				configurable: false,
				writable: false,
				enumerable: true,
			});
		}
	}
};

if (site.interface.post.view) {
	set_global_const(window, 'TAGS', WebKitLib.getTags);

	(function () {
		'use strict';

		const TAGS = window.TAGS;
		if (TAGS) console.log(TAGS); //	Print tags, to verify if it works
		/* -- OLD CODE --
		const TAGS = Array.from(
			document.querySelectorAll('#tag-sidebar > li > a:nth-child(2)')
		).map(
			tag => tag.innerText.replace(/\ /g, l => '_')
		);
		*/

		(function () {
			// Define CSS rules in a dictionary
			const styles = {
				'#container': {
					fontSize: `max(0.5em, calc(0.4vw + 0.2vh))`,
					position: 'fixed',
					display: `flex`,
					alignItems: `flex-start`,
					justifyContent: `space-between`,
					width: `100vw`,
					height: `100vh`,
					transition: `all ${1 / 16}s ease-out`, // Smooth transition
				},
				'#tags': {
					width: '20%',
					display: 'flex',
					flex: '0 0',
					flexBasis: `max-content`,
					flexDirection: 'column',
					overflowY: 'auto',
					height: '100vh',
					scrollbarWidth: `none`,
					// Add additional styling for tags
				},
				'#media': {
					display: 'flex',
					//flex: '1 0',
					flexBasis: `max-content`,
					contain: 'content',
					alignItems: 'center',
					justifyContent: 'center',
					maxHeight: `${100 + 0 * Math.pow(0.5, 1 / 2)}%`,
					maxWidth: `${0 + 100 * Math.pow(0.5, 1 / 2)}vw`,
					height: `2880px`,
					height: 'fit-content',
					height: '-webkit-fill-available',
					width: '-webkit-fill-available',
					//height: `max-content`,
					//maxHeight: `max-content`,
					//maxWidth: `max-content`,
				},
				'#media img, #media video': {
					width: '100%',
					height: '100%',
					objectFit: 'contain' // or 'cover' depending on your needs
				},			
				'div#right-col': {
					height: '100vh',
					width: `32rem`,
					maxWidth: `calc(100vw * 2 / 3)`,
					position: `fixed`,
					right: `0`,
					bottom: `0`,
					transform: `translate(80%, 0%)`,
					transition: `all calc(pow(sqrt(5) * 0.5 + 0.5, 2) * 1s) cubic-bezier(1, 0, 0.9, 1);`, /* Add transition for smooth animation */
					overflowY: 'scroll',
					scrollbarWidth: `none`,
				},
				'div#right-col:hover': {
					transform: `translate(0%, 0%)`,
					transition: `all calc(1s / 3) cubic-bezier(0.3, 0, 0.7, 1);`,
				},
				'#comments': {
					minWidth: '20%',
					display: 'flex',
					flex: 'auto',
					flex: 'content',
					flexDirection: 'column',
					overflowY: 'auto',
					height: '100vh',
					scrollbarWidth: `none`,
					// Add additional styling for comments
				},
				'#comments #header': {
					width: 'min-content',
					width: '100%',
					//display: 'flex',
					//flex: '0 0 60%',
					//flexDirection: 'column',
					//overflowY: 'auto',
					//height: '100vh'
					// Add additional styling for comments
				},
				'#comments img, #tagss img': {
					width: '100%',
				},
				'@media (max-width: 1024px)': {
					'#tags': {
						flexBasis: '30%',
					},
					'#media': {
						flexBasis: '40%',
					},
					'#comments': {
						flexBasis: '30%',
					}
				},
				'@media (min-width: 1024px)': {
					'#tags': {
						flexBasis: '10%',
						maxWidth: '256px', // Optional
					},
					'#media': {
						flexBasis: '70%',
					},
					'#comments': {
						flexBasis: '20%',
						maxWidth: '512px', // Optional
					}
				}
			};

			// Create a <style> element
			const styleElement = document.createElement('style');
			styleElement.type = 'text/css';
			styleElement.id = 'injector-style';

			function camel_to_kebab(str) {
				return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
			}

			// Convert the styles dictionary to a CSS string
			let cssString = '';
			for (const selector in styles) {
				if (styles.hasOwnProperty(selector)) {
					cssString += `${selector} {`;
					for (const property in styles[selector]) {
						if (styles[selector].hasOwnProperty(property)) {
							cssString += `${camel_to_kebab(property)}: ${styles[selector][property]};`;
						}
					}
					cssString += '} ';
				}
			}

			// Append the CSS string to the style element
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = cssString; // For IE8 and below
			} else {
				styleElement.appendChild(document.createTextNode(cssString)); // For other browsers
			}

			// Append the style element to the document head
			document.head.appendChild(styleElement);
		})();


		const media = document.querySelector(`video#gelcomVideoPlayer`) || document.querySelector('img#image')
		const is_video = (media.id === "gelcomVideoPlayer")

		const tb = document.createElement('div') //	Placeholder Table
		const content = document.createElement('div') //	Media Divider
		const layout = document.createElement('div') //	Leftover Content
		const tags = document.createElement('div') //	Tags Divider
		const sidebar = document.querySelector('div.sidebar') //	Sidebar Content
		const header_bar = document.querySelector('#header') //	Header Toolbar



		tb.id = 'container';
		content.id = 'media';
		layout.id = 'comments';
		tags.id = 'tags';

		const reformat = function (aspect) {
			//return
			//	Organize Layout
			{
				layout.append(document.querySelector('#long-notice'), document.querySelector('#notice'), document.querySelector('#content'))
				tb.append(tags, content, layout)
				//document.querySelector('#header').insertAdjacentElement("afterend", tb)
				document.body.insertBefore(tb, document.body.firstChild);

				tags.append(sidebar)
				content.append(media)

				/*
				Object.assign(tb.style, {
					fontSize: `max(8px, 0.5vw)`,
					display: `flex`,
					flex: `1`,
					alignItems: `flex-start`,
					justifyContent: `space-between`,
				})

				Object.assign(sidebar.style, {
					maxWidth: `${100 / 9}vw`,
					minWidth: `min-content`,
					//width: "max-content"
				})
				//*/

				media.removeAttribute('style');
			}
			return; {
				const calc = new Object()

				{
					calc.v = 100
					calc.v = `min(${calc.v}vh, ${calc.v / Math.pow(2, 0.25)}vw)`
					calc.cv = `(${calc.v} - ${16 + tb.offsetTop}px)`
					calc.cw = `(${calc.v} - ${16 + content.offsetLeft * 3}px)`
					calc.vh = `calc(${calc.cv})`
					calc.w = `calc(${calc.cw} * ${16 / 9})`
					calc.a = [`auto`, `100%`]
				}

				// Object.assign(media.style,  {
				// 	height		: ["auto", "100%"][(aspect < 0.5)],
				// 	width		: ["100%", "auto"][(aspect < 0.5)],
				// })
				Object.assign(media.style, {
					width: '-webkit-fill-available',
					height: '100%',
					objectFit: "contain"
				});
				Object.assign(content.style,
					(aspect < 0.5) ? {
						width: calc.vh
					} : {
						height: calc.vh
					}, {
						maxWidth: is_video ? calc.w : ""
					}
					// {
					// 	display: "flex",
					// 	flexDirection: "column"
					// }
				);
			}
		}

		// media

		if (is_video) {
			media.id = "nano-video"
			media.volume = 1 / 16
			media.controls = true
			media.onloadeddata = reformat(media.videoWidth / media.videoHeight)
		} else {
			media.id = "nano-img"
			reformat(media.clientWidth / media.clientHeight)
		}

		// const video = document.querySelector('div.content#right-col video')

		// Something random. L += dL = (1 - 300 / (300 + n_0 ... n_m)) // This is a leveling idea for gained XP after a game. It's based on 100 points per performant result, with 100 being the expected 'good' value, with an average of 200 points per session. The curve flattens as n approaches infinity. The maximum XP gained is always < 1. Based on the average, a score of 200 will yield an average of +0.4 XP gained per level. This remains constant, forever. Likely until some upper level cap exists. There the net gain will be L + min(dL, 1 - L), where L is the current level represented as a float and dL is the pending change in level.

		layout.append(header_bar)
	})();

}