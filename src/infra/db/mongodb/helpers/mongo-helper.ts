import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
    await this.client.connect()
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  }
}
