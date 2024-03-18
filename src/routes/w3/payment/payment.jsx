import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Container } from "@mui/material";
import { formatPrice } from "../../../utils/format-price";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils/fetcher";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoadingIcon from "../../../assets/icons/loading";
import { W2Header } from "../../../components/w2-header";
import orderClasses from "../order/order.module.css";
import classes from "./payment.module.css";
import { W3OrderCard } from "../../../components/w3-order-card";
import { W2Button } from "../../../components/w2-button";
import MoneyIcon from "../../../assets/icons/money";
import { useState } from "react";
import ChevronLeft from "../../../assets/icons/chevron-left";
import Wallet from "../../../assets/icons/wallet";
import { PaymentSelect } from "../../../components/payment-select";
import { createTransactionRequest } from "../../../services/transaction";
import { updateOrderRequest } from "../../../services/order";
import { BottomSheet } from "react-spring-bottom-sheet";
import { ReviewForm } from "../../../components/review-form";
import { createReviewRequest } from "../../../services/review";
import { AnimatedCheckIcon } from "../../../components/animated-checkicon/animated-checkicon";
import { useCartContext } from "../../../context/cart/provider";

const tips = [20, 15, 10, 5, 0];

const W2Payment = () => {
  const [params] = useSearchParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [isOrderCreating, setIsOrderCreating] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState({
    review: false,
    payment: false,
  });
  const { mutate: processOrder } = useMutation({
    mutationFn: ({ type, order_id }) =>
      fetcher(`v1/rest/order-${type}-process`, { order_id }),
  });
  const {
    mutate: createTransaction,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
  } = useMutation({
    mutationFn: ({ payment_sys_id, order_id }) =>
      createTransactionRequest(order_id, { payment_sys_id }),
  });
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentSelectModalOpen, setPaymentSelectModalOpen] = useState(false);
  const { hideOrderLink } = useCartContext();
  const { data: order, isFetching: isOrderLoading } = useQuery(
    ["orderlist"],
    () =>
      fetcher(`v1/rest/orders/table/${params.get("table_id")}`).then((res) =>
        res.json(),
      ),
  );
  const {
    mutate: writeReview,
    isLoading: writeReviewLoading,
    isSuccess: isReviewSuccess,
    isError: isReviewError,
  } = useMutation({
    mutationFn: (data) => createReviewRequest(order?.data.id, data),
    onSuccess: () => {
      setIsReviewModalOpen(false);
      handleSnackBar("review", true);
    },
  });
  const { mutate: updateTip } = useMutation({
    mutationFn: (data) => updateOrderRequest(order?.data.id, data),
  });
  const subTotal = order?.data?.details?.reduce(
    (acc, curr) => acc + curr.total_price,
    0,
  );
  const calculatedTip =
    ((order?.data?.total_price || 1) * (selectedTip === 0 ? 1 : selectedTip)) /
      100 || 0 + (customTip ? Number(customTip) : 0);
  const handleSnackBar = (type, value) => {
    setIsSnackbarVisible((old) => ({ ...old, [type]: value }));
  };

  if (isOrderLoading) {
    return (
      <>
        <W2Header type="w3" />
        <Stack my={10} alignItems="center">
          <LoadingIcon size={40} />
        </Stack>
      </>
    );
  }

  if (!order?.data) {
    return (
      <>
        <W2Header type="w3" />
        <Container maxWidth="sm">
          <Typography variant="h5" textAlign="center">
            There is nothing to see
          </Typography>
        </Container>
      </>
    );
  }

  if (isTransactionSuccess) {
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
            <AnimatedCheckIcon isVisible={isTransactionSuccess} />
          </Stack>
          <Typography color="black" variant="h5" textAlign="center">
            Payment succesfull
          </Typography>
          <W2Button
            onClick={() =>
              navigate({ pathname: "/w3/menu", search }, { replace: true })
            }
            size="large"
          >
            Back to menu
          </W2Button>
        </Stack>
      </Stack>
    );
  }

  const handlePayment = () => {
    setIsOrderCreating(true);
    if (customTip || selectedTip) {
      updateTip(
        {
          tips: customTip || selectedTip,
          tip_type: selectedTip ? "percent" : "fix",
        },
        {
          onSuccess: () => {
            if (selectedPayment?.tag !== "cash") {
              processOrder({
                type: selectedPayment?.tag,
                order_id: order?.data.id,
              });
            }
            createTransaction(
              {
                payment_sys_id: selectedPayment?.id,
                order_id: order?.data.id,
              },
              {
                onSettled: () => {
                  setIsOrderCreating(false);
                  handleSnackBar("payment", true);
                  hideOrderLink();
                },
              },
            );
          },
        },
      );
    } else {
      if (selectedPayment?.tag !== "cash") {
        processOrder({ type: selectedPayment?.tag, order_id: order?.data.id });
      }
      createTransaction(
        {
          payment_sys_id: selectedPayment?.id,
          order_id: order?.data.id,
        },
        {
          onSettled: () => {
            setIsOrderCreating(false);
            handleSnackBar("payment", true);
            hideOrderLink();
          },
        },
      );
    }
  };

  return (
    <div className={`${classes.container}`}>
      {isReviewSuccess && (
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={isSnackbarVisible.review}
          autoHideDuration={100}
        >
          <Alert
            severity="success"
            onClose={() => handleSnackBar("review", false)}
            sx={{ width: "100%" }}
          >
            Review succesfully created
          </Alert>
        </Snackbar>
      )}
      {isTransactionError && (
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={isSnackbarVisible.payment}
          autoHideDuration={100}
          onClose={{}}
        >
          <Alert
            severity="error"
            onClose={() => handleSnackBar("payment", false)}
            sx={{ width: "100%" }}
          >
            Payment failed
          </Alert>
        </Snackbar>
      )}
      {isReviewError && (
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={isSnackbarVisible.review}
          autoHideDuration={100}
        >
          <Alert
            severity="error"
            onClose={() => handleSnackBar("payment", false)}
            sx={{ width: "100%" }}
          >
            Create review failed
          </Alert>
        </Snackbar>
      )}
      <Container maxWidth="sm">
        <W2Header type="w3" />
        <Stack px={2} my={4}>
          <Typography fontWeight={600} variant="subtitle2">
            Table: {order?.data.table?.name}
          </Typography>
          <Typography fontWeight={600} color="gray" variant="subtitle2">
            Order opened:{" "}
            {new Date(order?.data.created_at).toLocaleDateString()}{" "}
            {new Date(order?.data.created_at).toLocaleTimeString()}
          </Typography>
          <Typography fontWeight={600} color="gray" variant="subtitle2">
            Order: {order?.data.id}
          </Typography>
        </Stack>
        {order?.data.waiter && (
          <div className={classes.waiter}>
            <img
              src={order?.data.waiter.img}
              alt={order?.data.waiter.firstname}
              className={classes.waiterImage}
            />
            <Stack>
              <Typography variant="subtitle1">
                {order?.data.waiter.firstname}
              </Typography>
              <Typography variant="caption">Waiter</Typography>
            </Stack>
          </div>
        )}
        <Stack px={2} mb={4} gap="10px" direction="row" alignItems="center">
          <W2Button
            onClick={() => navigate({ pathname: "/w3/menu", search })}
            variant="blackBtn"
          >
            Menu
          </W2Button>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className={classes.blackBtn}
          >
            <span className={classes.text}>Review</span>
          </button>
        </Stack>
        <div className={orderClasses.reciept}>
          <div className={orderClasses.recieptContent}>
            {order?.data?.details?.map((detail) => {
              return (
                <W3OrderCard
                  key={detail.id}
                  disabled
                  data={{
                    ...detail.stock.product,
                    stock: {
                      amount: detail.quantity,
                      total_price: detail.stock.total_price,
                      price: detail.stock.price,
                      discount: detail.stock.discount,
                    },
                    addons: detail.addons,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className={orderClasses.reciept} style={{ margin: "2rem 0" }}>
          <Stack px={2} spacing="1.25rem">
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <div className={classes.moneyWrapper}>
                <MoneyIcon />
              </div>

              <Typography variant="subtitle1" fontWeight={600}>
                Хотите оставить чаевые?
              </Typography>
            </Stack>
            <input
              type="number"
              className={classes.moneyInput}
              onFocus={() => setSelectedTip(null)}
              placeholder="Ввести сумму"
              value={!customTip && customTip !== 0 ? "" : customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              min={0}
            />
            <Stack
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              {tips.map((tip) => (
                <button
                  onClick={() => {
                    setSelectedTip(tip);
                    setCustomTip(undefined);
                  }}
                  className={`${classes.tip} ${
                    tip === selectedTip ? classes.active : ""
                  }`}
                  key={tip}
                >
                  {tip === 0 ? "No" : `%${tip}`}
                </button>
              ))}
            </Stack>
          </Stack>
        </div>
      </Container>
      <div className={classes.summary}>
        <button
          onClick={() => setPaymentSelectModalOpen(true)}
          className={classes.paymentMethod}
        >
          <div
            className={`${classes.paymentMethodIcon} ${
              selectedPayment && classes.paymentMethodActive
            }`}
          >
            <Wallet />
          </div>
          <Typography variant="subtitle2" fontWeight={500}>
            {selectedPayment ? selectedPayment.tag : "Add payment method"}
          </Typography>
        </button>
        <Stack direction="row" py={2} justifyContent="space-between">
          <Typography variant="subtitle1">Subtotal</Typography>
          <Typography variant="subtitle1">{formatPrice(subTotal)}</Typography>
        </Stack>
        {!!selectedTip && selectedTip > 0 && (
          <Stack direction="row" pb={2} justifyContent="space-between">
            <Typography variant="subtitle1">Service %{selectedTip}</Typography>
            <Typography variant="subtitle1">
              {formatPrice(calculatedTip)}
            </Typography>
          </Stack>
        )}
        <Stack
          direction="row"
          py={2}
          borderTop="1px solid #898989"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="subtitle1">
            {formatPrice(order?.data.total_price + calculatedTip)}
          </Typography>
        </Stack>
        <Stack gap="10px" direction="row" justifyContent="space-between">
          <button onClick={() => navigate(-1)} className={classes.backButton}>
            <ChevronLeft />
          </button>
          <W2Button
            onClick={handlePayment}
            disabled={!selectedPayment}
            loading={isOrderCreating}
          >
            Continue to payment —{" "}
            {formatPrice(order?.data.total_price + calculatedTip)}
          </W2Button>
        </Stack>
      </div>
      <PaymentSelect
        onDismiss={() => setPaymentSelectModalOpen(false)}
        open={paymentSelectModalOpen}
        selectedPayment={selectedPayment}
        onSelect={(payment) => setSelectedPayment(payment)}
      />
      <BottomSheet
        open={isReviewModalOpen}
        onDismiss={() => setIsReviewModalOpen(false)}
      >
        <ReviewForm
          onSubmit={(data) => writeReview(data)}
          loading={writeReviewLoading}
        />
      </BottomSheet>
    </div>
  );
};

export default W2Payment;
