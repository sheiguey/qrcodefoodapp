import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { W2Header } from "../../../components/w2-header";
import { CategoryNav } from "../../../components/category-nav";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SHOP_ID } from "../../../config/site-settings";
import { fetcher } from "../../../utils/fetcher";
import { Banners } from "../../../components/banner/banners";
import { InfiniteLoader } from "../../../components/infinite-loader";
import { extractData } from "../../../utils/extract-data";
import { ProductList } from "../../../components/product-list/product-list";
import { useState } from "react";
import { W2FoodDetail } from "../../../components/w2-food-detail";

const W2Menu = () => {
  const [searchParams] = useSearchParams();
  const [selectedFood, setSelectedFood] = useState(null);
  const queryClient = useQueryClient();
  const shopId = searchParams.get("shop_id") || SHOP_ID;
  const handleOpenDetail = (product) => {
    queryClient.setQueryData(["productdetail", product.uuid], {
      data: product,
    });
    setSelectedFood(product.uuid);
  };
  const { data: recommended, isLoading: isRecommendedLoading } = useQuery(
    ["recommended"],
    () =>
      fetcher("v1/rest/branch/recommended/products", {
        shop_id: shopId,
        recPerPage: 5,
      }).then((res) => res.json())
  );
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(
      ["productlist"],
      ({ pageParam = 1 }) =>
        fetcher(`v1/rest/branch/products`, {
          page: pageParam,
          shop_id: shopId,
        }).then((res) => res.json()),
      {
        getNextPageParam: (lastPage) =>
          lastPage.links.next && lastPage.meta.current_page + 1,
      }
    );
  const productsByCategory = extractData(data?.pages);

  return (
    <Container className="w2-container" maxWidth="sm">
      {!!selectedFood && (
        <W2FoodDetail
          open={!!selectedFood}
          onDismiss={() => setSelectedFood(null)}
          id={selectedFood}
        />
      )}
      <W2Header type="w2" />
      <CategoryNav categories={productsByCategory} loading={isLoading} />
      <Banners type="w2" />
      <ProductList
        products={recommended?.data}
        id="recommended"
        title="Recommended"
        onFoodClick={(product) => handleOpenDetail(product)}
        loading={isRecommendedLoading}
      />
      <InfiniteLoader
        hasMore={hasNextPage}
        loading={isFetchingNextPage}
        loadMore={() => fetchNextPage()}
      >
        <Stack spacing={1.5}>
          {productsByCategory?.map((productByCategory) => (
            <ProductList
              id={productByCategory.uuid}
              title={productByCategory.translation?.title}
              products={productByCategory.products}
              key={productByCategory.id}
              onFoodClick={(product) => handleOpenDetail(product)}
              loading={isLoading}
            />
          ))}
        </Stack>
      </InfiniteLoader>
    </Container>
  );
};

export default W2Menu;
