/*
Copyright - 2017 2022 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/*
Changes:
	- v1.4.0:
		- created
	- v1.5.0:
		- code review
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
		- Issue ♯63 : Find a better solution for provider keys upload
	- v1.7.0:
		- added line and circle icons
		- modified bike, pedestrian and car icons
	- v1.6.0:
		- Issue ♯102 : Sometime the provider toolbar is incomplete at startup
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Tests ...
*/

import theTravelNotesData from '../data/TravelNotesData.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import ProviderToolbarTransitModeButton from '../providersToolbarUI/ProviderToolbarTransitModeButton.js';
import ProviderToolbarProviderButton from '../providersToolbarUI/ProviderToolbarProviderButton.js';
import theAPIKeysManager from '../core/APIKeysManager.js';
import { NOT_FOUND, ZERO, TWO } from '../main/Constants.js';
import theTranslator from '../UILib/Translator.js';
import theConfig from '../data/Config.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the provider and transitModes toolbar at the bottom of the UI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProvidersToolbarUI {

	/**
	The container
	@type {HTMLElement}
	*/

	#container;

	/**
	The top bar
	@type {HTMLElement}
	*/

	#topBar;

	/**
	The toolbar HTMLElement
	@type {HTMLElement}
	*/

	#toolbarHTMLElement;

	/**
	A JS map with the transit mode buttons, ordered by transitMode
	@type {Map}
	*/

	#transitModeButtons;

	/**
	A JS map with the provider buttons, ordered by provider.name
	@type {Map}
	*/

	#providerButtons;

	/**
	the active transit mode button
	@type {ProviderToolbarTransitModeButton}
	*/

	#activeTransitModeButton;

	/**
	the active provider button
	@type {ProviderToolbarProviderButton}
	*/

	#activeProviderButton;

	/**
	Timer id for the mouse leave event
	@type {Number}
	*/

	#timerId;

	/**
	A boolean saving the the current state of the UI
	@type {boolean}
	 */

	#isShow;

	/**
	The delay needed for the timer that start the #removeHidden ( ) method
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #HIDDEN_DELAY ( ) { return 100; }

	/**
	The delay between a mouseenter and a click event.
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MOUSE_EVENT_MAX_DELAY ( ) { return 100; }

	/**
	Transit mode buttons creation
	*/

	#createTransitModesButtons ( ) {
		[ 'bike', 'pedestrian', 'car', 'train', 'line', 'circle' ].forEach (
			transitMode => {
				const transitModeButton = new ProviderToolbarTransitModeButton ( this, transitMode );
				this.#transitModeButtons.set ( transitMode, transitModeButton );
				this.#toolbarHTMLElement.appendChild ( transitModeButton.buttonHTMLElement );
			}
		);

	}

	/**
	Provider buttons creation
	*/

	#createProvidersButtons ( ) {
		theTravelNotesData.providers.forEach (
			provider => {
				if ( ! provider.providerKeyNeeded || theAPIKeysManager.hasKey ( provider.name ) ) {
					const providerButton = new ProviderToolbarProviderButton ( this, provider );
					this.#providerButtons.set ( provider.name, providerButton );
					this.#toolbarHTMLElement.appendChild ( providerButton.buttonHTMLElement );
				}
			}
		);
	}

	/**
	Show the UI
	*/

	#show ( ) {
		this.#centerUI ( );
		this.#isShow = true;
		setTimeout ( ( ) => this.#removeHidden ( ), ProvidersToolbarUI.#HIDDEN_DELAY );
	}

	/**
	Remove the TravelNotes-Hidden class on the toolbar. It's needed to use a timer (see the #show ( ) method) to
	remove the class, otherwise one of the button of the toolbar is clicked when the toolbar is show by clicking
	on the header on touch devices
	*/

	#removeHidden ( ) {
		this.#toolbarHTMLElement.classList.remove ( 'TravelNotes-Hidden' );
	}

	/**
	The timestamp pf the last mouseenter or click event
	@type {Number}
	*/

	#lastMouseEventTimestamp;

	/**
	Mouse enter event listener
	@param {Event} mouseEvent the trigered event
	*/

	#onClick ( mouseEvent ) {

		// When the delay is lower than #MOUSE_EVENT_MAX_DELAY 	we consider that the click event and the
		// mouse enter event are trigered by the same user action on touch devices
		// and the click event is cancelled
		if ( ProvidersToolbarUI.#MOUSE_EVENT_MAX_DELAY > mouseEvent.timeStamp - this.#lastMouseEventTimestamp ) {
			return;
		}

		this.#onMouseEnter ( mouseEvent );
	}

	/**
	Mouse enter event listener
	@param {Event} mouseEvent the trigered event
	*/

	#onMouseEnter ( mouseEvent ) {
		this.#lastMouseEventTimestamp = mouseEvent.timeStamp;
		if ( this.#isShow ) {
			this.hide ( );
		}
		else {

			// cleaning the timer
			if ( this.#timerId ) {
				clearTimeout ( this.#timerId );
				this.#timerId = null;
			}
			this.#show ( );
		}
	}

	/**
	Mouse leave event listener
	*/

	#onMouseLeave ( ) {
		if ( this.#isShow ) {
			this.#timerId = setTimeout ( ( ) => this.hide ( ), theConfig.layersToolbarUI.toolbarTimeOut );
		}
	}

	/**
	Center the UI on the lower side of the screen
	*/

	#centerUI ( ) {
		this.#topBar.textContent = theTranslator.getText (
			'ProvidersToolbarUI - Computed by {provider} for {transitMode}',
			{
				provider : theTravelNotesData.routing.provider,
				transitMode : theTranslator.getText (
					'ProvidersToolbarUI - TransitMode ' + theTravelNotesData.routing.transitMode
				)
			}
		);
		this.#container.style.left =
			String ( ( theTravelNotesData.map.getContainer ( ).clientWidth - this.#container.clientWidth ) / TWO ) + 'px';
	}

	/**
	The constructor
	*/

	constructor ( ) {

		Object.freeze ( this );

		this.#transitModeButtons = new Map ( );
		this.#providerButtons = new Map ( );

	}

	/**
	Hide the UI. Used as event listener for the timer
	*/

	hide ( ) {

		// cleaning the timer
		if ( this.#timerId ) {
			clearTimeout ( this.#timerId );
			this.#timerId = null;
		}
		this.#toolbarHTMLElement.classList.add ( 'TravelNotes-Hidden' );
		this.#centerUI ( );
		this.#isShow = false;
	}

	/**
	Creation of the UI
	*/

	createUI ( ) {

		this.#container = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ProvidersToolbarUI-Container'
			},
			document.body
		);

		this.#topBar = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ProvidersToolbarUI-TopBar',
				textContent : theTranslator.getText ( 'TravelNotes-ProvidersToolbarUI - Providers' )
			},
			this.#container
		);

		// toolbar creation
		this.#toolbarHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ProvidersToolbarUI-ImgButtonsDiv TravelNotes-Hidden'
			},
			this.#container
		);

		this.#topBar.addEventListener (
			'click',
			mouseEvent => this.#onClick ( mouseEvent ),
			false
		);
		this.#container.addEventListener (
			'mouseenter',
			mouseEvent => this.#onMouseEnter ( mouseEvent ),
			false
		);
		this.#container.addEventListener (
			'mouseleave',
			mouseEvent => this.#onMouseLeave ( mouseEvent ),
			false
		);

		// buttons creation
		this.#createTransitModesButtons ( );
		this.#createProvidersButtons ( );

		// set the first provider in the map as active provider
		this.provider = this.#providerButtons.keys ().next ().value;
		this.#centerUI ( );
	}

	/**
	set a provider as active provider
	*/

	set provider ( providerName ) {
		theTravelNotesData.routing.provider = providerName;

		// removing previous provider
		if ( this.#activeProviderButton ) {
			this.#activeProviderButton.active = false;
		}

		// set the new provider
		this.#activeProviderButton = this.#providerButtons.get ( providerName );
		this.#activeProviderButton.active = true;

		// transit mode buttons activation
		const provider = theTravelNotesData.providers.get ( providerName.toLowerCase ( ) );
		this.#transitModeButtons.forEach (
			transitModeButton => {
				transitModeButton.visible = NOT_FOUND !== provider.transitModes.indexOf ( transitModeButton.transitMode );
			}
		);

		// transit mode button selection if the current one is not more valid
		if (
			! this.#activeTransitModeButton
			||
			NOT_FOUND === provider.transitModes.indexOf ( this.#activeTransitModeButton.transitMode )
		) {
			this.#activeTransitModeButton = null;
			this.#transitModeButtons.forEach (
				transitModeButton => {
					if (
						( ! this.#activeTransitModeButton )
						&&
						NOT_FOUND !== provider.transitModes.indexOf ( transitModeButton.transitMode )
					) {
						this.#activeTransitModeButton = transitModeButton;
						transitModeButton.active = true;
						theTravelNotesData.routing.transitMode = transitModeButton.transitMode;
					}
					else {
						transitModeButton.active = false;
					}
				}
			);

		}
		this.#centerUI ( );
	}

	/**
	set a transit mode as active transit mode
	*/

	set transitMode ( transitMode ) {
		theTravelNotesData.routing.transitMode = transitMode;
		if ( this.#activeTransitModeButton ) {
			this.#activeTransitModeButton.active = false;
		}
		this.#activeTransitModeButton = this.#transitModeButtons.get ( transitMode );
		this.#activeTransitModeButton.active = true;
		this.#centerUI ( );
	}

	/**
	Reset the toolbar when providers added ( see providersadded event )
	*/

	providersAdded ( ) {
		while ( this.#toolbarHTMLElement.firstChild ) {
			this.#toolbarHTMLElement.removeChild ( this.#toolbarHTMLElement.firstChild );
		}
		this.#transitModeButtons.clear ( );
		this.#providerButtons.clear ( );
		this.#createTransitModesButtons ( );
		this.#createProvidersButtons ( );
		this.provider = this.#providerButtons.keys ().next ().value;
		const providerName = this.#providerButtons.keys ( ).next ( ).value;
		this.provider = providerName;
		this.transitMode = theTravelNotesData.providers.get ( providerName.toLowerCase ( ) ).transitModes [ ZERO ];
		this.#centerUI ( );
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ProvidersToolbarUI class
@type {ProvidersToolbarUI}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theProvidersToolbarUI = new ProvidersToolbarUI ( );

export default theProvidersToolbarUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */