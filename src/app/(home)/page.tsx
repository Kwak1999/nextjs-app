import getProducts, {ProductsParams} from "@/app/actions/getProducts";
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";

interface HomeProps {
    searchParams: ProductsParams
}


export default async function Home({searchParams}: HomeProps) {

    const products = await getProducts(searchParams)

    console.log(products)

    return (
      <Container>
        {/*    Categories     */}
        {/*<EmptyState />*/}

          {
              products?.data.length === 0
              ?
              <EmptyState />
              :
              <>
                <div>
ddd
                </div>
              </>
          }
      </Container>
  )

}
