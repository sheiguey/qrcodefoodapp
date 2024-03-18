import { BackButton } from "../../components/back-button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { OrderCard } from "../../components/order-card";
import { Container } from "@mui/material";
import { formatPrice } from "../../utils/format-price";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../utils/fetcher";
import { useSearchParams } from "react-router-dom";
import LoadingIcon from "../../assets/icons/loading";

const Payment = () => {
  const [params] = useSearchParams();
  const { data: order, isLoading } = useQuery(["orderlist"], () =>
    fetcher(`v1/rest/orders/table/${params.get("table_id")}`).then((res) =>
      res.json()
    )
  );
  const total_items = order?.data?.details?.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );
  const total_price = order?.data?.details?.reduce(
    (acc, curr) => acc + curr.total_price,
    0
  );

  if (isLoading) {
    return (
      <>
        <BackButton />
        <Stack my={10} alignItems="center">
          <LoadingIcon size={40} />
        </Stack>
      </>
    );
  }

  if (!order?.data) {
    return (
      <>
        <BackButton />
        <Container maxWidth="sm">
          <Typography variant="h5" textAlign="center">
            There is nothing to see
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <BackButton />
      <Container maxWidth="sm">
        <Stack px={1} gap={1} mb={2} alignItems="center">
          <Typography variant="h5">Previously ordered items</Typography>
          {order?.data?.details?.map((detail) => {
            return (
              <OrderCard
                key={detail.id}
                isComplete
                product={{
                  ...detail.stock.product,
                  amount: detail?.quantity,
                  stock: {
                    total_price: detail.stock?.total_price,
                  },
                }}
              />
            );
          })}
        </Stack>
        <Stack
          sx={{
            borderRadius: "1rem",
            backgroundColor: "var(--color-gray-hover)",
          }}
          p={2}
          gap={2}
          mx={1}
          mb={20}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={500}>
              Total items
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {total_items}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={500}>
              Total amount
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {formatPrice(total_price)}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default Payment;
