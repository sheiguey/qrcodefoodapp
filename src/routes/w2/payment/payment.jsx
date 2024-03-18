import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { formatPrice } from "../../../utils/format-price";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils/fetcher";
import { useSearchParams } from "react-router-dom";
import LoadingIcon from "../../../assets/icons/loading";
import { W2Header } from "../../../components/w2-header";
import { W2OrderCard } from "../../../components/w2-order-card/w2-order-card";

const W2Payment = () => {
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
        <W2Header type="w2" />
        <Stack my={10} alignItems="center">
          <LoadingIcon size={40} />
        </Stack>
      </>
    );
  }

  if (!order?.data) {
    return (
      <>
        <W2Header type="w2" />
        <Container maxWidth="sm">
          <Typography variant="h5" textAlign="center">
            There is nothing to see
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <div className="w2-container">
      <Container maxWidth="sm">
        <W2Header type="w2" />
        <Typography px={2} mt={2} variant="h5">
          Previously ordered items
        </Typography>
        <Stack mx={2} gap={1} mb={2}>
          {order?.data?.details?.map((detail) => {
            return (
              <W2OrderCard
                key={detail.id}
                disabled
                data={{
                  ...detail.stock.product,
                  stock: {
                    amount: detail.quantity,
                    total_price: detail.stock?.total_price,
                    price: detail.stock.price,
                    discount: detail.stock.discount,
                  },
                }}
              />
            );
          })}
        </Stack>
        <Stack
          sx={{
            borderRadius: "5px",
            backgroundColor: "var(--color-gray-hover)",
          }}
          p={2}
          gap={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={500}>
              Order ID
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {order?.data.id}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight={500}>
              Table
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {order?.data?.table?.name}
            </Typography>
          </Stack>
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
    </div>
  );
};

export default W2Payment;
