class DialogDragStartEL {

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
	@param {Event} dragStartEvent The event to handle
	*/

	handleEvent ( dragStartEvent ) {
		this.#mover.setDragStartPoint ( dragStartEvent );
		dragStartEvent.dataTransfer.setData ( 'ObjId', this.#mover.objId );
	}
}

export default DialogDragStartEL;