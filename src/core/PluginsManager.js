class PluginsManager {

   	/**
	A JS map with the provider objects. Providers objects are created and added by the plugins
	@type {Map.<BaseRouteProvider>}
	*/

	#providers;

	/**
	A JS map with the provider objects. Providers objects are created and added by the plugins
	@type {Map.<BaseRouteProvider>}
	*/

	get providers ( ) { return this.#providers; }

	addProvider ( providerClass ) {
		const provider = new providerClass ( );
		const providerName = provider.name.toLowerCase ( );
		if ( ! this.#providers.get ( providerName ) ) {
			this.#providers.set ( providerName, provider );
		}
	}

	constructor ( ) {
		Object.freeze ( this );
		this.#providers = new Map ( );
	}
}

const thePluginsManager = new PluginsManager;

export default thePluginsManager;