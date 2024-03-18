import classes from "./order-card.module.css";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { formatPrice } from "../../utils/format-price";

export const W3OrderCard = ({ data }) => {
  return (
    <div className={classes.card}>
      <div className={classes.cardMain}>
        <Typography variant="subtitle2" fontWeight={500}>
          {data.translation?.title}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          width="40%"
          justifyContent="space-between"
        >
          <Typography variant="caption" color="gray">
            {data.stock.amount}x
          </Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {formatPrice(data.stock?.total_price)}
          </Typography>
        </Stack>
      </div>
      <Stack>
        {data?.addons?.map((addon) => (
          <Typography key={addon.id} variant="caption" color="gray">
            {addon.translation?.title || addon.stock.product.translation?.title}{" "}
            {addon.quantity} x {formatPrice(addon.stock.price)}
          </Typography>
        ))}
      </Stack>
    </div>
  );
};
