export default class CanyonProduct {

    productName;
    availabilityMap;
    image;

    constructor(productName, availabilityMap, image) {
        this.productName = productName;
        this.availabilityMap = availabilityMap;
        this.image = image;
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
}