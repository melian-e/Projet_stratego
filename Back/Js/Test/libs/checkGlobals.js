let checkGlobals = (function() {
	let getGlobalNumbers = () => Object.keys(window).length;
	let globalsNumbers = getGlobalNumbers();
	return function() {
		console.log("yes, ",getGlobalNumbers(), " ,", globalsNumbers);
		return getGlobalNumbers() - globalsNumbers;
	}
})();
