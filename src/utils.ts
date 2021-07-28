import { cv, cvTranslateError } from 'opencv-wasm';
import fs from 'fs';
export const isFileExisted = (filename: string): boolean => {
	try {
		fs.statSync(filename);
		return true;
	} catch (error) {
		return false;
	}
}
export const createFileFromUrl = (options: { path: string, url: string }, callback: Function) => {
	let request = new XMLHttpRequest();
	request.open('GET', options.url, true);
	request.responseType = 'arraybuffer';
	request.onload = function (ev) {
		if (request.readyState === 4) {
			if (request.status === 200) {
				let data = new Uint8Array(request.response);
				try {
					cv.FS_createDataFile('/', options.path, data, true, false, false);
				} catch (err) {
					console.error(cvTranslateError(cv, err));
				}
				callback();
			} else {
				console.error('Failed to load ' + options.url + ' status: ' + request.status);
			}
		}
	};
	request.send();
};