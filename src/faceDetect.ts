import Jimp from 'jimp';
import path from 'path';
import { cv } from 'opencv-wasm';
import { createFileFromUrl } from './utils';

export interface faceDetectOptions {
	dirName: string
	fileName: string
	cascadeFileUrl: string
	bestEffort: boolean
}
const faceDetect = (options: faceDetectOptions) => {
	// カスケードファイルをWebからダウンロード後、OpenCV.jsに読み込み
	let faceCascade = new cv.CascadeClassifier();
	let filename = options.cascadeFileUrl.split("/").slice(-1)[0] || "cascade.xml";
	createFileFromUrl({
		path: filename,
		url: options.cascadeFileUrl
	}).then((file) => {
		try {
			faceCascade.load(file);
		} catch (e) {
			console.error(e);
		}
	}).then(() => {
		// 処理する画像を読み込み、処理をスタート
		const imagePath = path.resolve(options.dirName, options.fileName);
		Jimp.read(imagePath).then(imageData => {
			const srcImage = cv.matFromImageData(imageData.bitmap);
			// 顔を認識して切り出し保存する関数
			const cropFace = (src: any) => {
				let grayscaleImage = new cv.Mat();
				cv.cvtColor(src, grayscaleImage, cv.COLOR_RGBA2GRAY, 0);
				let faces = new cv.RectVector();
				let msize = new cv.Size(0, 0);
				try {
					faceCascade.detectMultiScale(grayscaleImage, faces, 1.1, 3, 0, msize, msize);
				} catch (err) {
					console.error(err);
					console.log("hoge");
				}
				for (let i = 0; i < faces.size(); i++) {
					const face = faces.get(i);
					const cropArea = new cv.Rect(face.x, face.y, face.x + face.width, face.y + face.height);
					const dst = src.roi(cropArea);
					const output = new Jimp({
						width: dst.cols,
						height: dst.rows,
						data: Buffer.from(dst.data)
					});
					output.write(path.join(options.dirName, `edited-${i}-${options.fileName}`));
					dst.delete();
				}
				grayscaleImage.delete();
			}
			if (options.bestEffort === false) {
				cropFace(srcImage);
			} else {
				// 画像を何回か回転し、検出器が検出しやすいようにする
				const dsize = new cv.Size(srcImage.rows, srcImage.cols);
				const center = new cv.Point(srcImage.cols / 2, srcImage.rows / 2);
				[0, 40, 80, 120, 160, 200, 240, 280, 320].forEach(theta => {
					let rotatedImage = new cv.Mat();
					const rotationMat = cv.getRotationMatrix2D(center, theta, 1);
					cv.warpAffine(srcImage, rotatedImage, rotationMat, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
					// 処理
					cropFace(rotatedImage);
					// 後処理
					rotatedImage.delete();
					rotationMat.delete();
				})
			}
			srcImage.delete();

		})
	}).catch(error => {
		console.error(error);
	})
}
export default faceDetect;