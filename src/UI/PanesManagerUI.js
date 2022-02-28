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
	- v1.0.0:
		- created
	- v1.3.0:
		- added train button
	- v1.4.0:
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.12.0:
		- Issue ♯120 : Review the UserInterface
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210915
Doc reviewed 20210901
Tests ...
*/

import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import { MOUSE_WHEEL_FACTORS, PANE_ID } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the mane buttons
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PaneButtonClickEL {

	/**
	A reference to the PanesManagerUI Object
	@type {PanesManagerUI}
	*/

	#paneManagerUI = null;

	/**
	The constructor
	@param {PanesManagerUI} paneManagerUI A reference to the PanesManagerUI Object
	*/

	constructor ( paneManagerUI ) {

		Object.freeze ( this );

		this.#paneManagerUI = paneManagerUI;
	}

	/**
	Event listener method
	@param {Event} clickEvent The event to handle
	*/

	handleEvent ( clickEvent ) {
		this.#paneManagerUI.showPane ( clickEvent.target.dataset.tanPaneId );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
wheel event listeners for the PaneDataDiv
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PaneDataDivWheelEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} wheelEvent The event to handle
	*/

	handleEvent ( wheelEvent ) {
		if ( wheelEvent.deltaY ) {
			wheelEvent.target.scrollTop +=
				wheelEvent.deltaY * MOUSE_WHEEL_FACTORS [ wheelEvent.deltaMode ];
		}
		wheelEvent.stopPropagation ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class manages the differents panes on the UI
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PanesManagerUI {

	/**
	The pane id of the active pane
	@type {String}
	*/

	#activePaneId;

	/**
	A js Map with all the panes, ordered by paneId
	@type {Map}
	*/

	#panes;

	/**
	The HTMLElement in witch the data have to be added
	@type {HTMLElement}
	*/

	#paneData;

	/**
	The HTMLElement in witch the control have to be added
	@type {HTMLElement}
	*/

	#paneControl;

	/**
	The header with the panes buttons
	@type {HTMLElement}
	*/

	#headerDiv;

	/**
	This method remove the content of the Data Pane Div
	*/

	#removeActivePane ( ) {
		if ( PANE_ID.invalidPane !== this.#activePaneId ) {
			this.#panes.get ( this.#activePaneId ).remove ( );
		}
	}

	/**
	The constructor
	@param {HTMLElement} uiMainDiv The HTMLElement in witch the PaneManagerUI must be included
	*/

	constructor ( uiMainDiv ) {

		Object.freeze ( this );

		this.#activePaneId = PANE_ID.invalidPane;
		this.#panes = new Map ( );

		// Header div ( buttons ) creation
		this.#headerDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-UI-FlexRowDiv'
			},
			uiMainDiv
		);

		// paneControl creation
		this.#paneControl = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-PanesManagerUI-PaneControlsDiv'
			},
			uiMainDiv
		);

		// paneData creation
		this.#paneData = theHTMLElementsFactory.create (
			'div',
			{
				id : 'TravelNotes-PanesManagerUI-PaneDataDiv'
			},
			uiMainDiv
		);
		this.#paneData.addEventListener ( 'wheel', new PaneDataDivWheelEL ( ), { passive : true } );
	}

	/**
	add a pane to the PanesManagerUI
	@param {Class} paneClass The class of the pane to add
	*/

	addPane ( paneClass ) {

		const pane = new paneClass ( this.#paneData, this.#paneControl );
		this.#panes.set ( pane.paneId, pane );

		// Pane button creation
		theHTMLElementsFactory.create (
			'div',
			{
				textContent : pane.buttonText,
				className : 'TravelNotes-PanesManagerUI-PaneButton',
				dataset : { PaneId : pane.paneId }
			},
			this.#headerDiv
		).addEventListener ( 'click', new PaneButtonClickEL ( this ) );
	}

	/**
	show a pane to the PanesManagerUI
	@param {String} paneId The pane id of the pane to be displayed
	*/

	showPane ( paneId ) {

		// removing current pane
		this.#removeActivePane ( );

		// adding the pane
		this.#activePaneId = paneId;
		this.#panes.get ( this.#activePaneId ).add ( );

		// changing the button style
		document.querySelectorAll ( '.TravelNotes-PanesManagerUI-PaneButton' ).forEach (
			paneButton => {
				if ( paneButton.dataset.tanPaneId === this.#activePaneId ) {
					paneButton.classList.add ( 'TravelNotes-PanesManagerUI-ActivePaneButton' );
				}
				else {
					paneButton.classList.remove ( 'TravelNotes-PanesManagerUI-ActivePaneButton' );
				}
			}
		);
	}

	/**
	Update a pane ( = show the pane only if the pane is the active pane )
	@param {string|number} paneId the pane id of the pane to be displayed
	*/

	updatePane ( paneId ) {
		if ( paneId === this.#activePaneId ) {
			this.showPane ( paneId );
		}
	}
}

export default PanesManagerUI;

/* --- End of file --------------------------------------------------------------------------------------------------------- */