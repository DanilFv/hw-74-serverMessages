import express, {Request, Response} from 'express';
import {promises as fs} from 'fs';
import {IMessage} from './types';

const messagesRouter = express.Router();


messagesRouter.get('/', async (req: Request, res: Response) => {
   try {
       const path = './messages';
       const files = await fs.readdir(path);
       const messages: IMessage[] = await Promise.all(
           files.map(async file => {
               const content = await fs.readFile(`${path}/${file}`, 'utf-8');
               return JSON.parse(content);
           })
       );

       const sortedMessages = messages.slice(-5);

       res.send(sortedMessages);

   } catch (e) {
       console.error(e);
   }
});

messagesRouter.post('/', async (req: Request, res: Response) => {
    try {
        if (!req.body.message) {
            return res.status(400).send({ error: "Invalid message" });
        }

        const datetime = new Date().toISOString();
        const newMessage: IMessage = {
            message: req.body.message,
            datetime: datetime,
        };

        const fileName = datetime.replace(/:/g, '-');
        await fs.writeFile(`./messages/${fileName}.txt`, JSON.stringify(newMessage));

        res.send(newMessage);
    } catch (e) {
        console.error("Error", e);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

export default messagesRouter;