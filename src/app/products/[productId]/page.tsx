import React from 'react';
import getProductById from "@/app/actions/getProductById";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ProductClient from "@/app/products/[productId]/ProductClient";
import EmptyState from "@/app/components/EmptyState";

interface Params{
    productId: string;
}

const ProductPage = async ({params}: {params: Params}) => {

    const product = await getProductById(params);
    const currentUser = await getCurrentUser();

    // console.log('product', product);

    if(!product) {
        return (
            <EmptyState />
        )
    }


    return (
        <ProductClient
            product={product}
            currentUser={currentUser}
        />
    );
};

export default ProductPage;