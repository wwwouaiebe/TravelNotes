/* ------------------------------------------------------------------------------------------------------------------------- */
/**
click event listener for the ok button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OkButtonClickEL {

	/**
	A reference to the dialog
	@type {ModalBaseDialog}
	*/

	#modalBaseDialog;

	/**
	The constructor
	@param {ModalBaseDialog} modalBaseDialog A reference to the dialog
	*/

	constructor ( modalBaseDialog ) {
		Object.freeze ( this );
		this.#modalBaseDialog = modalBaseDialog;
	}

	/**
	Event listener method
	*/

	handleEvent ( ) {
		this.#modalBaseDialog.onOk ( );
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
	@type {ModalBaseDialog}
	*/

	#modalBaseDialog;

	/**
	The constructor
	@param {ModalBaseDialog} modalBaseDialog A reference to the dialog
	*/

	constructor ( modalBaseDialog ) {
		Object.freeze ( this );
		this.#modalBaseDialog = modalBaseDialog;
	}

	/**
	Event listener method
	@param {Event} keyDownEvent The event to handle
	*/

	handleEvent ( keyDownEvent ) {

		if ( ! this.#modalBaseDialog.keyboardELEnabled ) {
			return;
		}

		if ( 'Escape' === keyDownEvent.key || 'Esc' === keyDownEvent.key ) {
			this.#modalBaseDialog.onCancel ( );
		}
		else if ( 'Enter' === keyDownEvent.key ) {
			this.#modalBaseDialog.onOk ( );
		}

	}
}

export {
	OkButtonClickEL,
	DialogKeyboardKeydownEL
};