import express, {Request, Response} from 'express';
import {promises as fs} from 'fs';

const messagesRouter = express.Router();

messagesRouter.get('/', (req: Request, res: Response) => {
   res.send('hello world');
});

messagesRouter.post('/', async (req: Request, res: Response) => {
    try {
        if (!req.body.message) {
            return res.status(400).send({ error: "Invalid message" });
        }

        const datetime = new Date().toISOString();
        const newMessage = {
            message: req.body.message,
            datetime: datetime,
        };

        const fileName = datetime.replace(/:/g, '-');

        await fs.writeFile(`./messages/${fileName}.txt`, JSON.stringify(newMessage));

        res.send(newMessage);
    } catch (e) {
        console.error("Ошибка при записи:", e);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

export default messagesRouter;