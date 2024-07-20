import express from 'express';
import axios from 'axios';
import tf from '@tensorflow/tfjs-node';
import nsfwjs from 'nsfwjs';


const MODEL_URL = process.env.MODEL_URL || 'https://raw.githubusercontent.com/x-dr/nsfwjs-api/main/models/model.json'
const app = express();
app.use(express.json());

const model = await nsfwjs.load(MODEL_URL, { size: 299 });

async function processImage(url) {
	try {
		const pic = await axios.get(url, {
			responseType: 'arraybuffer',
		})

		if (url.endsWith(".gif")) {
			const predictions = await model.classifyGif(pic.data)
			const rating = {}
			predictions.forEach((item) => {
				item.forEach((classItem) => {
					const className = classItem.className;
					const probability = classItem.probability;

					if (rating[className]) {
						rating[className] += probability;
					} else {
						rating[className] = probability;
					}
				});
			});
			const totalCount = predictions.length;
			Object.keys(rating).forEach((className) => {
				rating[className] /= totalCount;
			});

			return rating



		} else {
			const image = await tf.node.decodeImage(pic.data, 3)
			const predictions = await model.classify(image)
			image.dispose()
			const rating = {}
			predictions.forEach(predictions => {
				rating[predictions.className] = predictions.probability;
			});

			return rating
		}

	} catch (err) {
		console.error(err);
		throw new Error("Error occurred while processing the image.");
	}
}

app.get("/", async (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.headers['x-client-ip'] || req.headers['fwd'];

	const html = `
	  <html>
		<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
		<title>nsfwjs-api</title>
		</head>
		<body>
		  <h1>使用方法：</h1>
		  <p>GET /rating?url=图片地址</p>
		  <h2>返回值：</h2>

		  <code>
			{
			  Drawing: 0.000001,
			  Hentai: 0.000001,
			  Neutral: 0.000001,
			  Porn: 0.000001,
			  Sexy: 0.000001,
			  status: 200,
			  rating: 1,
			  url: "图片地址"
			}
			</code>

		  <p>${ip}</p>
		</body>
	  </html>
	`;

	res.status(200).send(html);
});



app.get("/rating", async (req, res) => {
	const url = req.query.url;
	if (!url) {

		return res.status(400).json({
			status: 400,
			message: "Invalid URL."
		});
	}
	try {

		let rating = await processImage(url);
		rating.url = url;
		rating.status = 200
		console.log(rating.Porn + rating.Hentai + rating.Sexy);
		const rate = rating.Porn + rating.Hentai + rating.Sexy
		if (rating.Porn > 0.4 || rate > 0.8) {
			rating.rating_index = 3;
		} else if ((rating.Sexy > 1 && rating.Sexy < 0.6 && rating.Porn > 0.1 && rating.Porn < 0.4) || rate > 0.1) {
			rating.rating_index = 2;
		} else {
			rating.rating_index = 1;
		}

		res.status(200).json(rating);

	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: 500,
			message: "Error occurred while processing the image."
		});
	}
});


const port = process.env.PORT || 3035;

app.listen(port, () => {
	console.log(`Server is ready. listening on http://localhost:${port} .`);
});