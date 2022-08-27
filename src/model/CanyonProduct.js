export default class CanyonProduct {

    productName;
    price;
    availabilityMap;
    image;
    url;

    constructor(productName, price, availabilityMap, image, url) {
        this.productName = productName;
        this.price = price;
        this.availabilityMap = availabilityMap;
        this.image = image;
        this.url = url;
    }

    getProductName() {
        return this.productName;
    }

    getAvailabilityMap() {
        return this.availabilityMap;
    }

    getImage() {
        return this.image;
    }

    getUrl() {
        return this.url;
    }

    getPrice() {
        return this.price;
    }
}