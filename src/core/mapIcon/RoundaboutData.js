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
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

/**
A simple container to store data on roundabouts
*/

class RoundaboutData {

	/**
	A boolean indicating when the roundabout is a mini roundabout
	@type {Boolean}
	*/

	isMini;

	/**
	A boolean indicating when the icon is placed at the entry of a roundabout
	@type {Boolean}
	*/

	isEntry;

	/**
	A boolean indicating when the icon is placed at the exit of a roundabout
	@type {Boolean}
	*/

	isExit;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.seal ( this );
		this.isMini = false;
		this.isEntry = false;
		this.isExit = false;
	}
}

export default RoundaboutData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */