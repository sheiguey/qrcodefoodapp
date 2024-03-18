import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import classes from "./w2-order.module.css";
import { useCartContext } from "../../../context/cart/provider";
import { W2OrderCard } from "../../../components/w2-order-card";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatPrice } from "../../../utils/format-price";
import { W2Button } from "../../../components/w2-button";
import ChevronLeft from "../../../assets/icons/chevron-left";
import { BottomSheet } from "react-spring-bottom-sheet";
import { DeliveryType } from "../../../components/delivery-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrderRequest } from "../../../services/order";
import { fetcher } from "../../../utils/fetcher";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AnimatedCheckIcon } from "../../../components/animated-checkicon/animated-checkicon";

const W2Order = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: currencies } = useQuery(["currencylist"], () =>
    fetcher("v1/rest/currencies").then((res) => res.json())
  );
  const { cart, clearCart, total_price, total_amount } = useCartContext();
  const [selectedDelivery, setSelectedDelivery] = useState("dine_in");
  const [isDeliveryTypeOpen, setIsDeliveryTypeOpen] = useState(false);

  const {
    mutate: createOrder,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (data) => createOrderRequest(data),
  });
  const handleClose = () => {
    setIsDeliveryTypeOpen(false);
  };
  const handleCreateOrder = async (deliveryType) => {
    if (isLoading) return;
    const defaultCurrency = currencies?.data.find(
      (currency) => currency.default
    );
    const products = cart.map((cartItem) => ({
      stock_id: cartItem.stock.id,
      quantity: cartItem.stock.amount,
    }));
    const addons = cart.flatMap((cartItem) =>
      cartItem.addons.map((addon) => ({
        stock_id: addon.stock.id,
        quantity: addon.quantity,
        parent_id: addon.parent_id,
      }))
    );
    const data = {
      currency_id: defaultCurrency.id,
      rate: defaultCurrency.rate,
      table_id: searchParams.get("table_id"),
      shop_id: searchParams.get("shop_id"),
      delivery_type: deliveryType,
      products: products.concat(addons),
    };
    createOrder(data, {
      onSuccess: () => {
        clearCart();
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
              backgroundColor: "var(--color-w2primary)",
            }}
          >
            <AnimatedCheckIcon isVisible={isSuccess} />
          </Stack>
          <Typography color="black" variant="h5" textAlign="center">
            Order successfully created
          </Typography>
          <W2Button onClick={() => navigate(-1)}>Back to menu</W2Button>
        </Stack>
      </Stack>
    );
  }
  return (
    <div className="w2-container">
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={isSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Order successfully created
        </Alert>
      </Snackbar>
      <BottomSheet
        open={isDeliveryTypeOpen}
        onDismiss={handleClose}
        className={classes.modal}
      >
        <DeliveryType
          deliveryType={selectedDelivery}
          onChange={(value) => {
            setSelectedDelivery(value);
            handleClose();
            handleCreateOrder(value);
          }}
        />
      </BottomSheet>
      <Container maxWidth="sm">
        <Stack
          px={2}
          direction="row"
          py={"14px"}
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
            Your orders
          </Typography>
          <button onClick={() => clearCart()} className={classes.clearButton}>
            Clear
          </button>
        </Stack>
        <Stack px={2} pb={30}>
          {cart.map((cartItem) => (
            <W2OrderCard data={cartItem} key={cartItem.id} />
          ))}
        </Stack>
      </Container>
      <div className={classes.summary}>
        <Stack direction="row" py={2} justifyContent="space-between">
          <Typography variant="subtitle1">Subtotal</Typography>
          <Typography variant="subtitle1">
            {formatPrice(total_price)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          py={2}
          borderTop="1px solid #898989"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="subtitle1">
            {formatPrice(total_amount)}
          </Typography>
        </Stack>
        <Stack gap="10px" direction="row" justifyContent="space-between">
          <button
            disabled={isLoading}
            onClick={() => navigate(-1)}
            className={classes.backButton}
          >
            <ChevronLeft />
          </button>
          <W2Button
            loading={isLoading}
            onClick={() => setIsDeliveryTypeOpen(true)}
          >
            Continue to payment — {formatPrice(total_amount)}
          </W2Button>
        </Stack>
      </div>
    </div>
  );
};

export default W2Order;
