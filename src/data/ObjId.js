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
	- v1.4.0:
		- Initialization changed
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

import { ZERO } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
objId's generator
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ObjId {

	/**
	The last sed objId
	@type {Number}
	*/

	static #objId = ZERO;

	/**
	get a unique objId
	@type {Number}
	*/

	static get nextObjId ( ) { return ( ++ ObjId.#objId ); }

}

export default ObjId;

/* --- End of file --------------------------------------------------------------------------------------------------------- */