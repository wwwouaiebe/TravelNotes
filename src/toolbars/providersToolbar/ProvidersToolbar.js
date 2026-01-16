/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

import theTravelNotesData from '../../data/TravelNotesData.js';
import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import TransitModeButton from './TransitModeButton.js';
import ProviderButton from './ProviderButton.js';
import theApiKeysManager from '../../core/ApiKeysManager.js';
import { NOT_FOUND, ZERO, TWO } from '../../main/Constants.js';
import theTranslator from '../../core/uiLib/Translator.js';
import theConfig from '../../data/Config.js';
import theDevice from '../../core/lib/Device.js';
import thePluginsManager from '../../core/PluginsManager.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the provider and transitModes toolbar at the bottom of the UI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProvidersToolbar {

	/**
	 * The screenX coor. of the pointer after a pointerdown event
	 * @type {Number}
	 */

	#topbarScreenX = NOT_FOUND;

	/**
	 * The screenY coor. of the pointer after a pointerdown event
	 * @type {Number}
	 */

	#topbarScreenY = NOT_FOUND;

	/**
	The main HTMLElement of the toolbar
	@type {HTMLElement}
	*/

	#toolbarHTMLElement;

	/**
	The top bar
	@type {HTMLElement}
	*/

	#topBar;

	/**
	The toolbar HTMLElement
	@type {HTMLElement}
	*/

	#buttonsHTMLElement;

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
	@type {TransitModeButton}
	*/

	#activeTransitModeButton;

	/**
	the active provider button
	@type {ProviderButton}
	*/

	#activeProviderButton;

	/**
	A boolean saving the the current state of the toolbar
	@type {boolean}
	 */

	#isShow;

	/**
	Timer id for the pointerleave event
	@type {Number}
	*/

	#pointerLeaveTimerId;

	/**
	The delay needed for the timer that start the #removeHidden ( ) method
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #HIDDEN_DELAY ( ) { return 100; }

	/**
	Transit mode buttons creation
	*/

	#createTransitModesButtons ( ) {
		[ 'bike', 'pedestrian', 'car', 'train', 'line', 'circle' ].forEach (
			transitMode => {
				const transitModeButton = new TransitModeButton ( this, transitMode );
				this.#transitModeButtons.set ( transitMode, transitModeButton );
				this.#buttonsHTMLElement.appendChild ( transitModeButton.buttonHTMLElement );
			}
		);

	}

	/**
	Provider buttons creation
	*/

	#createProvidersButtons ( ) {
		thePluginsManager.providers.forEach (
			provider => {
				if ( ! provider.providerKeyNeeded || theApiKeysManager.hasKey ( provider.name ) ) {
					const providerButton = new ProviderButton ( this, provider );
					this.#providerButtons.set ( provider.name, providerButton );
					this.#buttonsHTMLElement.appendChild ( providerButton.buttonHTMLElement );
				}
			}
		);
	}

	/**
	Show the toolbar
	*/

	#show ( ) {

		// this.centerToolbar ( );
		this.#isShow = true;
		setTimeout ( ( ) => this.#removeHidden ( ), ProvidersToolbar.#HIDDEN_DELAY );

	}

	/**
	Remove the travelnotes-hidden class on the toolbar. It's needed to use a timer (see the #show ( ) method) to
	remove the class, otherwise one of the button of the toolbar is clicked when the toolbar is show by clicking
	on the header on touch devices
	*/

	#removeHidden ( ) {

		// we need first to move the toolbar on top, otherwise showing the toolbar will resize the screen.
		this.#toolbarHTMLElement.style.top = ZERO;
		this.#buttonsHTMLElement.classList.remove ( 'travelnotes-hidden' );
		this.centerToolbar ( );
	}

	/**
	 * Pointerdown on the topbar event listener
	 * @param {Event} pointerEvent The event to handle
	 */

	#onPointerDownTopbar ( pointerEvent ) {
		pointerEvent.preventDefault ( );
		theDevice.setPointerType ( pointerEvent );
		switch ( theDevice.pointerType ) {
		case 'touch' :
			this.#topbarScreenX = pointerEvent.screenX;
			this.#topbarScreenY = pointerEvent.screenY;
			break;
		default :
			break;
		}
	}

	/**
	 * Pointerup on the topbar event listener
	 * @param {Event} pointerEvent The event to handle
	 */

	#onPointerUpTopbar ( pointerEvent ) {
		pointerEvent.preventDefault ( );
		theDevice.setPointerType ( pointerEvent );
		switch ( theDevice.pointerType ) {
		case 'touch' :
			if (
				this.#topbarScreenX === pointerEvent.screenX
					&&
					this.#topbarScreenY === pointerEvent.screenY
			) {
				if ( this.#isShow ) {
					this.hide ( );
				}
				else {
					this.#show ( );
				}
			}
			break;
		default :
			break;
		}
	}

	/**
	pointerenter event listener
	@param {Event} pointerEvent The event to handle
	*/

	#onPointerEnterToolbarContainer ( pointerEvent ) {
		theDevice.setPointerType ( pointerEvent );
		switch ( theDevice.pointerType ) {
		case 'mouse' :
			if ( this.#pointerLeaveTimerId ) {
				clearTimeout ( this.#pointerLeaveTimerId );
				this.#pointerLeaveTimerId = null;
			}
			this.#show ( );
			break;
		default :
			break;
		}
	}

	/**
	pointerleave event listener
	@param {Event} pointerEvent The event to handle
	*/

	#onPointerLeaveToolbarContainer ( pointerEvent ) {
		theDevice.setPointerType ( pointerEvent );
		switch ( theDevice.pointerType ) {
		case 'mouse' :
			this.#pointerLeaveTimerId = setTimeout ( ( ) => this.hide ( ), theConfig.toolbars.timeOut );
			break;
		default :
			break;
		}
	}

	/**
	Hide the toolbar. Used as event listener for the timer
	*/

	hide ( ) {

		// cleaning the timer
		if ( this.#pointerLeaveTimerId ) {
			clearTimeout ( this.#pointerLeaveTimerId );
			this.#pointerLeaveTimerId = null;
		}
		this.#buttonsHTMLElement.classList.add ( 'travelnotes-hidden' );
		this.centerToolbar ( );
		this.#isShow = false;
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
	Center the toolbar on the lower side of the screen
	*/

	centerToolbar ( ) {
		this.#topBar.textContent = theTranslator.getText (
			'ProvidersToolbar - Computed by {provider} for {transitMode}',
			{
				provider : theTravelNotesData.routing.provider,
				transitMode : theTranslator.getText (
					'ProvidersToolbar - TransitMode ' + theTravelNotesData.routing.transitMode
				)
			}
		);
		this.#toolbarHTMLElement.style.left =
			String (
				( window.visualViewport.width - this.#toolbarHTMLElement.clientWidth ) / TWO
			) + 'px';
		this.#toolbarHTMLElement.style.top =
			String ( window.visualViewport.height - this.#toolbarHTMLElement.clientHeight - TWO ) + 'px';
	}

	/**
	Creation of the toolbar
	*/

	createUI ( ) {

		// Toolbar container creation
		this.#toolbarHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				id : 'travelnotes-providers-toolbar-container'
			},
			document.body
		);
		this.#toolbarHTMLElement.addEventListener (
			'pointerenter',
			pointerEvent => this.#onPointerEnterToolbarContainer ( pointerEvent ),
			false
		);
		this.#toolbarHTMLElement.addEventListener (
			'pointerleave',
			pointerEvent => this.#onPointerLeaveToolbarContainer ( pointerEvent ),
			false
		);

		// Topbar creation
		this.#topBar = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-providers-toolbar-top-bar',
				textContent : theTranslator.getText ( 'TravelNotes-ProvidersToolbar - Providers' )
			},
			this.#toolbarHTMLElement
		);
		this.#topBar.addEventListener (
			'pointerdown',
			pointerEvent => this.#onPointerDownTopbar ( pointerEvent ),
			false
		);
		this.#topBar.addEventListener (
			'pointerup',
			pointerEvent => this.#onPointerUpTopbar ( pointerEvent ),
			false
		);

		// container for the buttons
		this.#buttonsHTMLElement = theHTMLElementsFactory.create (
			'div',
			{
				className : 'travelnotes-providers-toolbar-img-buttons travelnotes-hidden'
			},
			this.#toolbarHTMLElement
		);

		// buttons creation
		this.#createTransitModesButtons ( );
		this.#createProvidersButtons ( );

		// set the first provider in the map as active provider
		this.provider = this.#providerButtons.keys ().next ().value;

		this.centerToolbar ( );
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
		const provider = thePluginsManager.providers.get ( providerName.toLowerCase ( ) );
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
		this.centerToolbar ( );
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
		this.centerToolbar ( );
	}

	/**
	Reset the toolbar when providers added ( see providersadded event )
	*/

	providersAdded ( ) {
		while ( this.#buttonsHTMLElement.firstChild ) {
			this.#buttonsHTMLElement.removeChild ( this.#buttonsHTMLElement.firstChild );
		}
		this.#transitModeButtons.clear ( );
		this.#providerButtons.clear ( );
		this.#createTransitModesButtons ( );
		this.#createProvidersButtons ( );
		this.provider = this.#providerButtons.keys ().next ().value;
		const providerName = this.#providerButtons.keys ( ).next ( ).value;
		this.provider = providerName;
		this.transitMode = thePluginsManager.providers.get ( providerName.toLowerCase ( ) ).transitModes [ ZERO ];
		this.centerToolbar ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of ProvidersToolbar class
@type {ProvidersToolbar}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theProvidersToolbar = new ProvidersToolbar ( );

export default theProvidersToolbar;

/* --- End of file --------------------------------------------------------------------------------------------------------- */