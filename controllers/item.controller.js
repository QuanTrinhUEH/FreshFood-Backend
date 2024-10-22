import itemService from "../service/item.service.js";

class itemHandler {
    async getItemsAdmin(req, res) {
        try {
            const { search = "", page = 1, pageSize = 10, status } = req.query;

            const maxPageSize = 100;
            const limitedPageSize = Math.min(pageSize, maxPageSize);

            const filters = search
                ? { itemName: { $regex: search, $options: "i" } } : {};
            if (status !== null && status !== undefined && status !== "") {
                filters.status = Number(status);
            }

            const { items, totalItemsCount } = await itemService.getItems(filters, page, limitedPageSize);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách sản phẩm cho admin thành công",
                data: {
                    items,
                    totalPages: Math.ceil(totalItemsCount / limitedPageSize),
                    totalCount: totalItemsCount,
                    currentPage: Number(page)
                },
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };

    async getItems(req, res) {
        try {
            const { search = "", page = 1, pageSize = 10 } = req.query;

            const maxPageSize = 100;
            const limitedPageSize = Math.min(pageSize, maxPageSize);

            const filters = search
                ? { itemName: { $regex: search, $options: "i" } } : {};
            filters.status = 1;

            const { items, totalItemsCount } = await itemService.getItems(filters, page, limitedPageSize);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách sản phẩm cho user thành công",
                data: {
                    items,
                    totalPages: Math.ceil(totalItemsCount / limitedPageSize),
                    totalCount: totalItemsCount,
                    currentPage: Number(page)
                },
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };

    async getItem(req, res) {
        try {
            const id = req.params.id;
            const item = await itemService.getItem(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Sản phẩm không tồn tại",
                    status: 404,
                    data: null
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Lấy sản phẩm thành công",
                    status: 200,
                    data: {
                        item: {
                            _id: item._id,
                            itemName: item.itemName,
                            price: item.price,
                            variants: item.variants,
                            description: item.description,
                            images: item.images,
                            foodType: item.foodType,
                            status: item.status,
                            promotion: item.promotion,
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt
                        }
                    }
                });
            }
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };

    async createItem(req, res) {
        const { itemName, price, variants, description, images, foodType, promotion } = req.body;

        try {
            const newItem = await itemService.createItem(itemName, price, variants, description, images, foodType, promotion);

            res.json({
                message: 'Tạo sản phẩm thành công',
                status: 201,
                data: {
                    item: {
                        itemName: newItem.itemName,
                        price: newItem.price,
                        variants: newItem.variants,
                        description: newItem.description,
                        images: newItem.images,
                        foodType: newItem.foodType,
                        promotion: newItem.promotion
                    }
                }
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };
    async updateItem(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedItem = await itemService.updateItem(id, updateData);

            res.status(200).json({
                message: "Cập nhật sản phẩm thành công",
                status: 200,
                data: {
                    item: {
                        itemName: updatedItem.itemName,
                        price: updatedItem.price,
                        variants: updatedItem.variants,
                        description: updatedItem.description,
                        images: updatedItem.images,
                        foodType: updatedItem.foodType,
                        status: updatedItem.status,
                        promotion: updatedItem.promotion
                    }
                }
            })
        } catch (error) {
            res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };

    async getItemsWithPromotions(req, res) {
        try {
            const { page = 1, pageSize = 10 } = req.query;

            const maxPageSize = 100;
            const limitedPageSize = Math.min(parseInt(pageSize), maxPageSize);

            const { items, totalItemsCount } = await itemService.getItemsWithPromotions(page, limitedPageSize);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách sản phẩm có khuyến mãi thành công",
                data: {
                    items,
                    totalPages: Math.ceil(totalItemsCount / limitedPageSize),
                    totalCount: totalItemsCount,
                    currentPage: Number(page)
                },
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };

    async getItemsByFoodType(req, res) {
        try {
            const { foodType } = req.params;
            const { page = 1, pageSize = 10 } = req.query;

            const maxPageSize = 100;
            const limitedPageSize = Math.min(parseInt(pageSize), maxPageSize);

            const { items, totalItemsCount } = await itemService.getItemsByFoodType(foodType, page, limitedPageSize);

            return res.status(200).json({
                success: true,
                message: "Lấy danh sách sản phẩm cùng loại thành công",
                data: {
                    items,
                    totalPages: Math.ceil(totalItemsCount / limitedPageSize),
                    totalCount: totalItemsCount,
                    currentPage: Number(page)
                },
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal server error",
                status: error.status || 500,
                data: error.data || null
            });
        }
    };
}

const itemController = new itemHandler();
export default itemController
