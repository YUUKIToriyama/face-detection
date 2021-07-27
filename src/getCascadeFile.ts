import fs from 'fs';
import fetch from 'node-fetch';
import { isFileExisted } from './utils';
const getCascadeFile = async (url: string): Promise<string> => {
	const filename = "cascade.xml";
	return new Promise(async (resolve, reject) => {
		fetch(url).then(response => {
			response.text().then(xml => {
				fs.writeFileSync(filename, xml);
			})
		}).catch(error => {
			console.error(error);
		}).finally(() => {
			if (isFileExisted(filename)) {
				resolve(filename);
			} else {
				reject(new Error("ファイルは存在しません"));
			}
		});
	})
}
export default getCascadeFile;