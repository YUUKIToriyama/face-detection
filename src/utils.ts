import fs from 'fs';
export const isFileExisted = (filename: string): boolean => {
	try {
		fs.statSync(filename);
		return true;
	} catch (error) {
		return false;
	}
}