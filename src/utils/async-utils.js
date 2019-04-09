import log from '../background/log';

/*
    Wait a random amount of time between {min} and {max} ms
    @return A Promise resolved when done
*/
function waitRandom(min, max) {
	if (max < min) max = min;
	return new Promise(resolve => {
		const random = min + Math.random() * (max - min);
		log(`Waiting ${random / 1000} seconds..`);
		setTimeout(resolve, random);
	});
}

/*
    Runs a set of async functions in sequence with a random timing in between.
    Each function must return a Promise and take no arguments
*/
/*
    @params fnQueue
        Array of functions () => Promise

    @returns An array of {any} after each function resolves 
        one after another with random intervals
*/

const runSequence = (fnQueue, min = 1000, max = 3000) => {
	log('Starting sequence');
	const results = [];
	var promise = Promise.resolve();

	for (let i = 0; i < fnQueue.length; i++) {
		const fn = fnQueue[i];
		promise = promise
			.then(fn)
			.then(res => {
				results.push(res);
				return waitRandom(min, max);
			})
			.catch(() => waitRandom(min, max));
	}

	return promise.then(() => results);
};

module.exports.runSequence = runSequence;
module.exports.waitRandom = waitRandom;
