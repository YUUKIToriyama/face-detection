import { cv, cvTranslateError } from 'opencv-wasm';
import fs from 'fs';
import fetch from 'node-fetch';
export const isFileExisted = (filename: string): boolean => {
	try {
		fs.statSync(filename);
		return true;
	} catch (error) {
		return false;
	}
}
export const createFileFromUrl = (options: { path: string, url: string }, callback: Function) => {
	fetch(options.url, {
		method: "GET"
	}).then(response => {
		if (response.status === 200) {
			return response.arrayBuffer();
		} else {
			throw Error('Failed to load ' + options.url + ' status: ' + response.status);
		}
	}).then(buffer => {
		let data = new Uint8Array(buffer);
		try {
			cv.FS_createDataFile('/', options.path, data, true, false, false);
			callback();
		} catch (err) {
			console.error(cvTranslateError(cv, err));
		}
	});
};