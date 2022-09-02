import User from '../model/User.js';
import GenericRepository from "../model/repositories/GenericRepository.js";

/**
 * @class UserController
 * @extends GenericRepository
 * @description UserController is a class that handles all user related operations
 */
export default class UserController {

    userRepository;

    constructor() {
        this.userRepository = new GenericRepository(User);
    }

    /**
     * Get a user by discordId
     * @param {*} discordId 
     * @returns a user object or undefined if not found
     */
    async getUser(discordId) {
        return this.userRepository.find({discordId: discordId});
    }

    /**
     * Create a user with the given discordId
     * @param {*} discordId 
     * @returns a new user object
     */
    async createUser(discordId) {
        return this.userRepository.create({discordId: discordId});
    }

    /**
     * Add a url to a user
     * @param {*} discordId
     * @param {*} url
     * @param {*} sizes
     * @returns the updated user object
     */
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

    /**
     * Delete a url from a user 
     * @param {*} discordId 
     * @param {*} url 
     * @returns updated user object
     */
    async deleteUrl(discordId, url) {
        return this.userRepository.update({discordId: discordId}, {
            $pull: {
                urls: {
                    url: url
                }
            }});
    }

    /**
     * Get a users urls
     * @param {*} discordId 
     * @returns a string containing all urls and sizes
     */
    async getUrls(discordId) {
        const user = await this.userRepository.find({discordId: discordId});

        if (!user || (Array.isArray(user) && user.length === 0)) {
            return "User not registered!";
        }
        
        let urlList = "";
        user[0].urls.forEach(url => {
            urlList += "url: " + url.url + "\n sizes: " + url.sizes.join(", ") + "\n";
        });

        return urlList;
    }

    /**
     * Get all users
     * @returns an array of all users
     */
    async getAllUsers() {
        return this.userRepository.find();
    }
}