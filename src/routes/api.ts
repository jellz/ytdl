import { Router, Request, Response } from 'express';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

const router = Router();

const formats = ['mp3', 'mp4'];
const ytRegex = /^(http(s)?:\/\/)((w){3}.)?youtu(be|.be)?(\.com)?\/watch\?v=[a-zA-Z0-9]+/;

router.get('/convert', async (req: Request, res: Response) => {
	const { url, format } = req.query as { url: string; format: string };
	if (!format || !url) return res.sendStatus(400);
	if (!formats.includes(format.toLowerCase())) return res.sendStatus(400);
	if (!ytRegex.test(url)) return res.sendStatus(400);

	const info = await ytdl.getBasicInfo(url);
	console.log(info);
	const slug = info.title.split(' ').join('_') + '_danielwashere';
	res.setHeader(
		'Content-Disposition',
		`attachment; filename=${slug}.${format}`
	);
	switch (format) {
		case 'mp4':
			ytdl(url).pipe(res);
			break;
		case 'mp3':
			ffmpeg(ytdl(url))
				.format('mp3')
				.audioBitrate(128)
				.pipe(res);
	}
});

export default router;
