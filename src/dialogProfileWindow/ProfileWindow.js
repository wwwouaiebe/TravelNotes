/*
Copyright - 2020 - wwwouaiebe - Contact: http//www.ouaie.be/

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
	- v1.7.0:
		- created
	- v1.8.0:
		- Issue ♯99 : Add distance in the elevation window
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import theTranslator from '../UILib/Translator.js';
import ObjId from '../data/ObjId.js';
import FloatWindow from '../dialogFloatWindow/FloatWindow.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import theEventDispatcher from '../coreLib/EventDispatcher.js';
import theUtilities from '../UILib/Utilities.js';
import SvgProfileBuilder from '../coreLib/SvgProfileBuilder.js';
import {
	SvgContextMenuEL,
	SvgMouseLeaveEL,
	SvgMouseMoveEL
} from '../dialogProfileWindow/ProfileWindowEventListeners.js';

import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
a float window containing a route profile
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ProfileWindow extends FloatWindow {

	/**
	The svg profile
	@type {SVGElement}
	*/

	#svg = null;

	/**
	A div under the svg profile with some texts
	@type {HTMLElement}
	*/

	#ascentDiv = null;

	/**
	The route for witch the profile is diplayed
	@type {Route}
	*/

	#route = null;

	/**
	contextmenu event listener
	@type {SvgContextMenuEL}
	*/

	#svgContextMenuEL = null;

	/**
	mousemove event listener
	@type {SvgMouseMoveEL}
	*/

	#svgMouseMoveEL = null;

	/**
	mouseleave event listener
	@type {SvgMouseLeaveEL}
	*/

	#svgMouseLeaveEL = null;

	/**
	An objId for the position marker
	@type {Number}
	*/

	#markerObjId = ObjId.nextObjId;

	/**
	This method removes the svg and event listeners from the window
	*/

	#clean ( ) {
		if ( this.#svg ) {
			this.#svg.removeEventListener ( 'contextmenu', this.#svgContextMenuEL, false );
			this.#svg.removeEventListener ( 'mousemove', this.#svgMouseMoveEL, false );
			this.#svg.removeEventListener ( 'mouseleave', this.#svgMouseLeaveEL, false );

			theEventDispatcher.dispatch ( 'removeobject', { objId : this.#markerObjId } );

			this.content.removeChild ( this.#ascentDiv );
			this.content.removeChild ( this.#svg );
		}

		this.#svg = null;
		this.#ascentDiv = null;
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
		this.#svgContextMenuEL = new SvgContextMenuEL ( );
		this.#svgMouseMoveEL = new SvgMouseMoveEL ( );
		this.#svgMouseLeaveEL = new SvgMouseLeaveEL ( );
	}

	/**
	Clean and close the window
	*/

	close ( ) {
		this.#clean ( );
		theEventDispatcher.dispatch (
			'profileclosed',
			{
				objId : this.#route.objId
			}
		);
		super.close ( );
	}

	/**
	Update the window's content
	@param {Route} route The Route for witch the profile must be updated
	*/

	update ( route ) {
		this.#clean ( );
		this.#route = route;
		this.#svg = new SvgProfileBuilder ( ).createSvg ( this.#route );
		this.#svg.dataset.tanObjId = route.objId;
		this.#svg.dataset.tanMarkerObjId = this.#markerObjId;

		this.header.textContent = theTranslator.getText (
			'ProfileWindow - Profile {name}',
			{ name : this.#route.computedName }
		);
		this.content.appendChild ( this.#svg );

		this.#svg.addEventListener ( 'contextmenu', this.#svgContextMenuEL, false );
		this.#svg.addEventListener ( 'mousemove', this.#svgMouseMoveEL, false );
		this.#svg.addEventListener ( 'mouseleave', this.#svgMouseLeaveEL, false );

		this.#ascentDiv = theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-ProfileWindow-Ascent',
				textContent : theTranslator.getText (
					'ProfileWindow - Ascent: {ascent} m. - Descent: {descent} m. - Distance: {distance}',
					{
						ascent : this.#route.itinerary.ascent.toFixed ( ZERO ),
						descent : this.#route.itinerary.descent.toFixed ( ZERO ),
						distance : theUtilities.formatDistance ( this.#route.distance )
					}
				)
			}
		);
		this.content.appendChild ( this.#ascentDiv );
	}
}

export default ProfileWindow;

/* --- End of file --------------------------------------------------------------------------------------------------------- */