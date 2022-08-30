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

        const upperSizes = sizes.map(element => {
            return element.toUpperCase();
        });

        return this.userRepository.update({discordId: discordId}, {
            $push: {
                urls: {
                    url: url,
                    sizes: upperSizes
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
}