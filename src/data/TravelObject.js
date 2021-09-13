import TravelUpdater from '../data/TravelUpdater.js';

class TravelObject {

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Verify that the parameter can be transformed to a TravelObject
	@param {Object} something an object to validate
	@return {Object} the validated object
	@throws {Error} when the parameter is invalid
	*/

	validateObject ( something ) {
		if ( ! Object.getOwnPropertyNames ( something ).includes ( 'objType' ) ) {
			throw new Error ( 'No objType for ' + this.objType.name );
		}
		this.objType.validate ( something.objType );
		if ( 'Travel' === this.objType.name && this.objType.version !== something.objType.version ) {
			new TravelUpdater ( ).update ( something );
		}
		let properties = Object.getOwnPropertyNames ( something );
		this.objType.properties.forEach (
			property => {
				if ( ! properties.includes ( property ) ) {
					throw new Error ( 'No ' + property + ' for ' + this.objType.name );
				}
			}
		);
		return something;
	}
}

export default TravelObject;