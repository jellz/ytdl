import { Router, Request, Response } from 'express';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import contentDisposition from 'content-disposition';

const router = Router();

const formats = ['mp3', 'mp4'];
const maxLength = 7200; // 2 hours in seconds
const ytRegex = /^(http(s)?:\/\/)((w){3}.)?youtu(be|.be)?(\.com)?\/watch\?v=[a-zA-Z0-9]+/;

router.get('/convert', async (req: Request, res: Response) => {
	let { url, format } = req.query as { url: string; format: string };
	if (!format || !url) return res.status(400).json({ error: 'Missing parameters' });
	if (!formats.includes(format.toLowerCase())) return res.status(400).json({ error: `The format provided is not a valid format; accepted formats are: ${formats.join(', ')}` })
	if (!ytRegex.test(url)) return res.status(400).json({ error: 'The url provided is not a YouTube video' })
	if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'Invalid video ID' });

	format = format.toLowerCase();

	const info = await ytdl.getBasicInfo(url);
	console.log(info.title);
	const isLive = info.player_response.videoDetails.isLiveContent;
	if (isLive) return res.status(400).json({ error: 'Livestreams are currently not supported' });

	const length = parseInt(info.length_seconds);
	if (length > maxLength) return res.status(400).json({ error: 'The video must be under 2 hours long' });

	const slug = info.title.split(' ').join('_') + '_danielwashere';
	res.setHeader(
		'Content-Disposition',
		contentDisposition(slug + format)
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
			break;
	}
});

export default router;
