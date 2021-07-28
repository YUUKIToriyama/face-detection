import { cv, cvTranslateError } from 'opencv-wasm';
import path from 'path';
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
export const createFileFromUrl = (options: { path: string, url: string }) => {
	return new Promise<string>((resolve, reject) => {
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
				cv.FS_createDataFile("/home", options.path, data, true, false, false);
				let filename = options.url.split("/").slice(-1)[0];
				if (filename !== undefined) {
					resolve(options.path);
				}
			} catch (err) {
				reject(cvTranslateError(cv, err));
			}
		}).catch(error => {
			reject(error);
		})
	})
};