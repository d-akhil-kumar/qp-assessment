export type queryParams = {
    page?: number;
    limit?: number;
    search?: string;
}

export type pagination = {
    page: number,
    limit: number,
    totalData: number,
    totalPages: number,
}

export type paymentLink = {
    link: string,
    paymentId: string,
}

export type createItem = {
    categoryId: string,
    items: [{
        name: string,
        price: number,
        unit: string,
        description: string,
        imageLink: string,
        stockQuantity: number,
    }]
}

export type editItem = {
    name: string,
    price: number,
    description: string,
    imageLink: string,
    stockQuantity: number,
    categoryId: string,
}