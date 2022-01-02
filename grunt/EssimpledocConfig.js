// essimpledoc config

module.exports = {
	debug : {
		options : {
			src : './src',
			dest : './docs/techDoc'
		}
	},
	doc : {
		options : {
			src : './src',
			dest : './docs/techDoc',
			validate : true
		}
	},
	doclaunch : {
		options : {
			src : './src',
			dest : './docs/techDoc',
			validate : true,
			launch : true
		}
	},
	release : {
		options : {
			src : './src',
			dest : './docs/techDoc',
			validate : true,
			launch : true
		}
	}
};