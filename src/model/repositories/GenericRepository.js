class GenericRepository {

    constructor(model) {
        this.model = model;
    }

    create(object) {
        return this.model.create(object);
    }

    find(object) {
        return this.model.find(object);
    }

    update(query, object) {
        return this.model.findOneAndUpdate(query, object, {new: true, useFindAndModify: false});
    }

    delete(object) {
        return this.model.remove(object);
    }
}

export default GenericRepository;