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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A simple class used to detect if the device have a touch screen
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class Device {

	/**
	A flag withe touch status
	@type {Boolean}
	*/

	static #isTouch;

	/**
	A touchstart event listener
	*/

	static #touchStartEL ( ) {
		Device.#isTouch = true;
		document.removeEventListener ( 'touchstart', Device.#touchStartEL, true );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		Device.#isTouch = false;
		document.addEventListener ( 'touchstart', Device.#touchStartEL, true );
	}

	/**
	The touch status. True when the device have a touch screen
	@type {Boolean}
	*/

	get isTouch ( ) { return Device.#isTouch; }
}

/**
The one and only one instance of Device class
*/

const theDevice = new Device ( );

export default theDevice;

/* --- End of file --------------------------------------------------------------------------------------------------------- */