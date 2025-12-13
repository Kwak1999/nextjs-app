import getProducts, {ProductsParams} from "@/app/actions/getProducts";
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ProductCard from "@/app/components/products/ProductCard";
import getCurrentUser from "@/app/actions/getCurrentUser";
import FloatingButton from "@/app/components/FloatingButton";
import Categories from "@/app/components/categories/Categories";
import Pagination from "@/app/components/Pagination";
import { PRODUCTS_PER_PAGE } from "@/types/constants";

interface HomeProps {
    searchParams: ProductsParams
}

export default async function Home({searchParams}: HomeProps) {

    const page = searchParams?.page;
    const pageNum = typeof page === 'string' ? Number(page) : 1;
    console.log('pageNum', pageNum);


    const params = await searchParams;  // ✅ Promise 풀기
    const products = await getProducts(params);  // 이제 안전함

    const currentUser = await getCurrentUser();

    console.log('@@@',products)

    return (
      <Container>
        {/*    Category     */}
        <Categories />

          {
              products?.data.length === 0
              ?
              <EmptyState showReset />
              :
              <>
                <div className='grid grid-cols-1 gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6'>
                    {products.data.map((product) => (
                        <ProductCard
                            currentUser = {currentUser}
                            key={product.id}
                            data={product}
                        />
                    ))}
                </div>
              </>
          }

          <Pagination page={pageNum} totalItems={products.totalItems} perPage={PRODUCTS_PER_PAGE} />

          <FloatingButton href="/products/upload">
              +
          </FloatingButton>
      </Container>
  )
}
