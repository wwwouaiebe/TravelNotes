class DialogDragEndEL {

	/**
	A reference to the mover object of the dialog
	@type {BaseDialogMover|DockableBaseDialogMover}
	*/

	#mover;

	/**
	The constructor
	@param {BaseDialogMover|DockableBaseDialogMover} mover A reference to the mover object of the dialog
	*/

 	constructor ( mover ) {
		Object.freeze ( this );
		this.#mover = mover;
	}

	/**
	Event listener method
	@param {Event} dragEndEvent The event to handle
	*/

	handleEvent ( dragEndEvent ) {
		this.#mover.moveDialog ( dragEndEvent );
	}

}

export default DialogDragEndEL;