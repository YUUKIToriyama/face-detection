#!/usr/bin/env node
import { program } from '@caporal/core';
import faceDetect, { faceDetectOptions } from './faceDetect';
program
	.argument("<file>", "Image file", {
		validator: program.STRING
	})
	.option("--cascade <url>", "Cascade file URL", {
		default: "https://github.com/opencv/opencv/raw/master/data/haarcascades/haarcascade_frontalcatface.xml",
		validator: program.STRING
	})
	.option("--best-effort <boolean>", "", {
		default: false,
		validator: program.BOOLEAN
	})
	.action(parsed => {
		const options: faceDetectOptions = {
			dirName: process.cwd(),
			fileName: parsed.args.file as string,
			cascadeFileUrl: parsed.options.cascade as string,
			bestEffort: parsed.options.bestEffort as boolean
		}
		faceDetect(options);
	});

program.run();