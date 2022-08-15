import NonModalBaseDialog from '../baseDialog/NonModalBaseDialog.js';

class DockableBaseDialog extends NonModalBaseDialog {

	#isShow;

	constructor ( ) {
		super ( );
		this.#isShow = false;
	}

	onCancel ( ) {
		if ( this.#isShow ) {
			super.onCancel ( );
			this.#isShow = false;
		}
	}

	show ( ) {
		if ( this.#isShow ) {
			return;
		}
		super.show ( );
		this.updateContent ( );
		this.#isShow = true;
	}

	get isShow ( ) { return this.#isShow; }

	updateContent ( ) {
	}
}

export default DockableBaseDialog;