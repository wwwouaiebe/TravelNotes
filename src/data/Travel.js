/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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
		- Replacing DataManager with TravelNotesData, Config, Version and DataSearchEngine
	- v1.5.0:
		- Issue ♯52 : when saving the travel to the file, save also the edited route.
	- v1.6.0:
		- Issue ♯65 : Time to go to ES6 modules?
	- v1.8.0:
		- Issue ♯100 : Fix circular dependancies with Collection
	- v2.0.0:
		- Issue ♯138 : Protect the app - control html entries done by user.
		- Issue ♯140 : Remove userData
		- Issue ♯146 : Add the travel name in the document title...
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210913
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file Travel.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module data
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import ObjId from '../data/ObjId.js';
import ObjType from '../data/ObjType.js';
import Collection from '../data/Collection.js';
import Route from '../data/Route.js';
import Note from '../data/Note.js';
import theHTMLSanitizer from '../coreLib/HTMLSanitizer.js';
import TravelObject from '../data/TravelObject.js';
import { INVALID_OBJ_ID } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class Travel
@classdesc This class represent a travel
@extends TravelObject
@hideconstructor

@-----------------------------------------------------------------------------------------------------------------------------
*/

class Travel extends TravelObject {

	static #objType = new ObjType ( 'Travel', [ 'editedRoute', 'routes', 'notes', 'layerName', 'name', 'readOnly', 'objId' ] );

	/**
	the route currently edited
	@type {Route}
	@private
	*/

	#editedRoute = new Route ( );

	/**
	a Collection of Routes
	@type {Collection.<Route>}
	@private
	*/

	#routes = new Collection ( Route );

	/**
	a Collection of Notes
	@type {Collection.<Note>}
	@private
	*/

	#notes = new Collection ( Note );

	/**
	the background map name
	@type {string}
	@private
	*/

	#layerName = 'OSM - Color';

	/**
	the Travel name
	@type {string}
	@private
	*/

	#name = '';

	/**
	a boolean indicates when the Travel is read only
	@type {boolean}
	@private
	*/

	#readOnly = false;

	/**
	the objId of the route
	@type {!number}
	@private
	*/

	#objId = INVALID_OBJ_ID;

	/*
	constructor
	*/

	constructor ( ) {
		super ( );
		this.#routes.add ( new Route ( ) );
		this.#objId = ObjId.nextObjId;

	}

	/**
	the route currently edited
	@type {Route}
	*/

	get editedRoute ( ) { return this.#editedRoute; }

	set editedRoute ( editedRoute ) {
		this.#editedRoute =
			editedRoute.objType && editedRoute.objType.name && 'Route' === editedRoute.objType.name
				?
				editedRoute
				:
				new Route ( );
	}

	/**
	a Collection of Routes
	@type {Collection.<Route>}
	@readonly
	*/

	get routes ( ) { return this.#routes; }

	/**
	a Collection of Notes
	@type {Collection.<Note>}
	@readonly
	*/

	get notes ( ) { return this.#notes; }

	/**
	the background map name
	@type {string}
	*/

	get layerName ( ) { return this.#layerName; }

	set layerName ( layerName ) {
		this.#layerName =
			'string' === typeof ( layerName )
				?
				theHTMLSanitizer.sanitizeToJsString ( layerName )
				:
				'OSM - Color';
	}

	/**
	the Travel name
	@type {string}
	*/

	get name ( ) { return this.#name; }

	set name ( Name ) {
		this.#name =
			'string' === typeof ( Name )
				?
				theHTMLSanitizer.sanitizeToJsString ( Name )
				:
				'';
	}

	/**
	a boolean indicates when the Travel is read only
	@type {boolean}
	*/

	get readOnly ( ) { return this.#readOnly; }

	set readOnly ( readOnly ) {
		this.#readOnly =
			'boolean' === typeof ( readOnly )
				?
				readOnly
				:
				true;
	}

	/**
	the objId of the Travel. objId are unique identifier given by the code
	@readonly
	@type {!number}
	*/

	get objId ( ) { return this.#objId; }

	/**
	the ObjType of the Travel.
	@type {ObjType}
	@readonly
	*/

	get objType ( ) { return Travel.#objType; }

	/**
	An object literal with the Travel properties and without any methods.
	This object can be used with the JSON object
	@type {Object}
	*/

	get jsonObject ( ) {
		return {
			editedRoute : this.editedRoute.jsonObject,
			layerName : this.layerName,
			name : this.name,
			routes : this.routes.jsonObject,
			notes : this.notes.jsonObject,
			readOnly : this.readOnly,
			objId : this.#objId,
			objType : this.objType.jsonObject
		};
	}

	set jsonObject ( something ) {
		const otherthing = this.validateObject ( something );
		this.editedRoute.jsonObject = otherthing.editedRoute;
		this.layerName = something.layerName;
		this.name = otherthing.name;
		this.readOnly = otherthing.readOnly;
		this.routes.jsonObject = otherthing.routes;
		this.notes.jsonObject = otherthing.notes;
		this.#objId = ObjId.nextObjId;
	}
}

export default Travel;

/*
--- End of Travel.js file -----------------------------------------------------------------------------------------------------
*/