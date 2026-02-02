import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    createMany = (pets) => this.dao.saveMany(pets);
    getById = (id) => this.dao.getBy({_id:id});



}