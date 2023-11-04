import { Item } from '@/models/Item';
import { MongoClient, ServerApiVersion } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export const client = new MongoClient(process.env.URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const { itemName, itemDescription, itemPrice, itemImage } = req.body;
      if (!itemName || !itemDescription || !itemPrice)
        return res
          .status(400)
          .json({ message: 'Parâmetros obrigatórios não informados!' });
      try {
        await createItem({
          itemName,
          itemDescription,
          itemPrice,
          itemImage,
        });
        res.status(201).json({
          message: 'criado!',
          item: {
            name: itemName,
            description: itemDescription,
            price: itemPrice,
            image: itemImage,
          },
        });
      } catch (error) {
        res.status(500).json({ error: 'erro inesperado' });
      }
      break;
    default:
      res.status(501).json({ error: 'método não implementado' });
      break;
  }
}

const createItem = async (item: Item) => {
  try {
    await client.connect();
    await client.db('coffeeShowDB').collection('items').insertOne({
      name: item.itemName,
      description: item.itemDescription,
      image: item.itemImage,
      price: item.itemPrice,
    });
  } catch (error) {
    return error;
  }
};
