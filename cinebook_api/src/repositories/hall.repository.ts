import { HallModel, IHall } from "../models/hall.model";

export class HallRepository {
    async create(data: Partial<IHall>) {
        return HallModel.create(data);
    }

    async findById(id: string) {
        return HallModel.findById(id).lean();
    }

    async find(query = {}, options = {}) {
        return HallModel.find(query, null, options).lean();
    }

    async update(id: string, data: Partial<IHall>) {
        return HallModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id: string) {
        return HallModel.findByIdAndDelete(id).lean();
    }
}
