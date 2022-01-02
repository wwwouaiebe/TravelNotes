// eslint-disable-next-line no-undef
module.exports = {
	beforeDebug : [ 'debug', 'tmpDebug', 'out' ],
	beforeRelease : [ 'dist', 'docs/demo', 'tmpRelease', 'out' ],
	afterDebug : [ 'tmpDebug', 'out' ],
	afterRelease : [ 'tmpRelease', 'out' ]
};