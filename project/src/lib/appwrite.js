import { Client, Databases } from 'appwrite';
const client = new Client();

const databases = new Databases(client)


client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64f930eab00dac51283b');

export default databases;