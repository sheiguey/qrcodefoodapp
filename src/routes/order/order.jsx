import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useCartContext } from "../../context/cart/provider";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import { fetcher } from "../../utils/fetcher";
import LoadingIcon from "../../assets/icons/loading";
import { formatPrice } from "../../utils/format-price";
import { AnimatedCheckIcon } from "../../components/animated-checkicon/animated-checkicon";
import { useEffect, useState } from "react";
import { OrderCard } from "../../components/order-card";
import { BackButton } from "../../components/back-button/back-button";

import MuiAlert from "@mui/material/Alert";
import { createOrderRequest } from "../../services/order";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert ref={ref} variant="filled" {...props} />;
});

const Order = () => {
  const [searchParams] = useSearchParams();
  const { data: currencies } = useQuery(["currencylist"], () =>
    fetcher("v1/rest/currencies").then((res) => res.json())
  );
  const { data: prevOrders, prevOrderLoading } = useQuery(["orderlist"], () =>
    fetcher(`v1/rest/orders/table/${searchParams.get("table_id")}`).then(
      (res) => res.json()
    )
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const { cart, clearCart, total_amount, total_items } = useCartContext();
  const [isError, setIsError] = useState(false);
  const { mutate: createOrder, isLoading } = useMutation({
    mutationFn: (data) => createOrderRequest(data),
    onError: () => {
      setIsError(true);
    },
  });
  const handleClose = () => {
    setIsError(false);
  };
  const navigate = useNavigate();
  const handleCreateOrder = async () => {
    if (isLoading) return;
    const defaultCurrency = currencies?.data.find(
      (currency) => currency.default
    );
    const data = {
      currency_id: defaultCurrency.id,
      rate: defaultCurrency.rate,
      table_id: searchParams.get("table_id"),
      shop_id: searchParams.get("shop_id"),
      delivery_type: "dine_in",
      products: cart.map((cartItem) => ({
        stock_id: cartItem.stock.id,
        quantity: cartItem.stock.amount,
      })),
    };
    createOrder(data, {
      onSuccess: () => {
        clearCart();
        setIsSuccess(true);
      },
    });
  };

  useEffect(() => {
    if (cart.length < 1 && !isSuccess) {
      navigate(-1);
    }
  }, [cart.length, navigate, isSuccess]);

  if (isSuccess) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        height="100vh"
        color="white"
      >
        <Stack justifyContent="center" alignItems="center" gap={4}>
          <Stack
            width={50}
            height={50}
            p={4}
            sx={{
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
            }}
          >
            <AnimatedCheckIcon isVisible={isSuccess} />
          </Stack>
          <Typography color="primary" variant="h5" textAlign="center">
            Order successfully created
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate(-1)}>
            Back to menu
          </Button>
        </Stack>
      </Stack>
    );
  }

  const prevOrdersTotalPrice = prevOrders?.data?.details?.reduce(
    (acc, curr) => acc + curr.total_price,
    0
  );

  return (
    <Container maxWidth="sm">
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={isError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Error occured during create order
        </Alert>
      </Snackbar>
      <Stack gap={2} px={1} pb={2}>
        <BackButton title="Order" />
        {cart.map((product) => (
          <OrderCard key={product.id} product={product} />
        ))}
        {prevOrderLoading && (
          <Stack my={10} alignItems="center">
            <LoadingIcon size={40} />
          </Stack>
        )}
        {prevOrders?.data && (
          <Typography variant="subtitle1">Previously ordered items</Typography>
        )}
        {prevOrders?.data?.details.map((detail) => (
          <OrderCard
            key={detail.id}
            isComplete
            product={{
              ...detail.stock.product,
              amount: detail.quantity,
              stock: {
                total_price: detail.stock.total_price,
              },
            }}
          />
        ))}
        <Stack
          sx={{
            borderRadius: "1rem",
            backgroundColor: "var(--color-gray-hover)",
          }}
          p={2}
          gap={2}
        >
          {prevOrders?.data?.details && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={500}>
                Previous orders amount
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {formatPrice(prevOrdersTotalPrice)}
              </Typography>
            </Stack>
          )}
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
              {formatPrice(total_amount)}
            </Typography>
          </Stack>
        </Stack>
        <Button
          size="large"
          disabled={isLoading}
          variant="contained"
          onClick={handleCreateOrder}
        >
          {isLoading ? <LoadingIcon size={26} /> : "Checkout"}
        </Button>
      </Stack>
    </Container>
  );
};

export default Order;
