import { HallRowModel, IHallRow } from "../models/hall-row.model";

export class HallRowRepository {
    async create(data: Partial<IHallRow>) {
        return HallRowModel.create(data);
    }

    async findByHallId(hallId: string) {
        return HallRowModel.find({ hallId }).sort({ order: 1 }).lean();
    }

    async deleteByHallId(hallId: string) {
        return HallRowModel.deleteMany({ hallId });
    }
}
