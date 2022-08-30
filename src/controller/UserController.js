import User from '../model/User.js';
import GenericRepository from "../model/repositories/GenericRepository.js";

export default class UserController {

    userRepository;

    constructor() {
        this.userRepository = new GenericRepository(User);
    }

    async getUser(discordId) {
        return this.userRepository.find({discordId: discordId});
    }

    async createUser(discordId) {
        return this.userRepository.create({discordId: discordId});
    }

    async addUrl(discordId, url, sizes) {
        const user = await this.getUser(discordId);

        if (!user || (Array.isArray(user) && user.length === 0)) {
            await this.createUser(discordId);
        }

        return this.userRepository.update({discordId: discordId}, {
            $push: {
                urls: {
                    url: url,
                    sizes: sizes
                }
            }});
    }

    async deleteUrl(discordId, url) {
        return this.userRepository.update({discordId: discordId}, {
            $pull: {
                urls: {
                    url: url
                }
            }});
    }

    async deleteAllUrls(discordId) {
        return this.userRepository.update({discordId: discordId}, {
            $set: {
                urls: []
            }});
    }

    async getUrls(discordId) {
        const user = await this.userRepository.find({discordId: discordId});
        return user.urls;
    }

    async getAllUsers() {
        return this.userRepository.find();
    }

    async getAllUrls() {
        const users = await this.getAllUsers();
        const urls = [];
        for (const user of users) {
            for (const url of user.urls) {
                urls.push({
                    discordId: user.discordId,
                    url: url.url,
                    sizes: url.sizes
                });
            }
        }
        return urls;
    }
}