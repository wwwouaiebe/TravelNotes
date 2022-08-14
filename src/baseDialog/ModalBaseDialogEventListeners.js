/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the ok button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OkButtonClickEL {

	/**
	A reference to the dialog
	@type {BaseDialog}
	*/

	#baseDialog;

	/**
	The constructor
	@param {BaseDialog} baseDialog A reference to the dialog
	*/

	constructor ( baseDialog ) {
		Object.freeze ( this );
		this.#baseDialog = baseDialog;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		this.#baseDialog.onOk ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
keydown event listener
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class DialogKeyboardKeydownEL {

	/**
	A reference to the dialog
	@type {BaseDialog}
	*/

	#baseDialog;

	/**
	The constructor
	@param {BaseDialog} baseDialog A reference to the dialog
	*/

	constructor ( baseDialog ) {
		Object.freeze ( this );
		this.#baseDialog = baseDialog;
	}

	/**
	Event listener method
	@param {Event} keyDownEvent The event to handle
	*/

	handleEvent ( keyDownEvent ) {

		if ( ! this.#baseDialog.keyboardELEnabled ) {
			return;
		}

		if ( 'Escape' === keyDownEvent.key || 'Esc' === keyDownEvent.key ) {
			this.#baseDialog.onCancel ( );
		}
		else if ( 'Enter' === keyDownEvent.key ) {
			this.#baseDialog.onOk ( );
		}

	}
}

export {
	OkButtonClickEL,
	DialogKeyboardKeydownEL
};