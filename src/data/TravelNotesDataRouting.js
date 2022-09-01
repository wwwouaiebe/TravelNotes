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
		- created from DataManager
		- added searchData
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...

-------------------------------------------------------------------------------------------------------------------------------
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
helper class to encapsulate the routing
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TravelNotesDataRouting {

	/**
	The routing provider
	@type {String}
	*/

	#provider = '';

	/**
	The routing transit mode
	@type {String}
	*/

	#transitMode = '';

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	The routing provider
	@type {String}
	*/

	get provider ( ) { return this.#provider; }

	set provider ( provider ) {
		this.#provider = 'string' === typeof ( provider ) ? provider : '';
	}

	/**
	The routing transit mode
	@type {String}
	*/

	get transitMode ( ) { return this.#transitMode; }

	set transitMode ( transitMode ) {
		this.#transitMode = 'string' === typeof ( transitMode ) ? transitMode : '';
	}
}

export default TravelNotesDataRouting;

/* --- End of file --------------------------------------------------------------------------------------------------------- */