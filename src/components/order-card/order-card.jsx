import { LazyLoadImage } from "react-lazy-load-image-component";
import { useCartContext } from "../../context/cart/provider";
import classes from "./order-card.module.css";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MinusIcon from "../../assets/icons/minus";
import PlusIcon from "../../assets/icons/plus";
import IconButton from "@mui/material/IconButton";
import Grow from "@mui/material/Grow";
import { formatPrice } from "../../utils/format-price";

export const OrderCard = ({ product, isComplete }) => {
  const { addToCart, cart, removeItem, toggleAmount } = useCartContext();
  const InList = cart.find((item) => item.id === product.id);
  return (
    <article className={classes.card}>
      <div className={classes.cardImage}>
        <LazyLoadImage
          alt={product?.translation.title}
          effect="blur"
          src={product.img}
        />
      </div>
      <Stack mb={2} flex={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={600} variant="body1">
            {product?.translation.title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="gray" className="line-clamp">
          {product?.translation.description}
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={2} alignItems="flex-end">
            <Typography fontWeight={600} variant="h4" color="primary">
              {formatPrice(product.stock.total_price)}
            </Typography>
            {isComplete && (
              <Typography variant="h6" color="primary">
                x{" "}
                <Typography ml={1} component="span">
                  {InList?.stock.amount || product?.amount}
                </Typography>
              </Typography>
            )}
          </Stack>
          {isComplete || (
            <Stack direction="row">
              <Grow
                in={!!InList}
                style={{
                  transformOrigin: "center right",
                  position: "absolute",
                  right: 0,
                }}
                unmountOnExit
              >
                <Stack direction="row" alignItems="center" gap={2}>
                  <IconButton
                    color="primary"
                    size="large"
                    onClick={() =>
                      InList.stock.amount <= product.min_qty ||
                      InList.stock.amount <= 1
                        ? removeItem(product.stock.id)
                        : toggleAmount(product.stock.id, "dec")
                    }
                  >
                    <MinusIcon />
                  </IconButton>
                  <Typography fontWeight={500} variant="body1" color="primary">
                    {InList?.stock.amount}
                  </Typography>
                  <IconButton
                    onClick={() => toggleAmount(product.stock.id, "inc")}
                    color="primary"
                    size="large"
                  >
                    <PlusIcon />
                  </IconButton>
                </Stack>
              </Grow>
              <Grow in={!InList} style={{ transformOrigin: "center left" }}>
                <div>
                  <IconButton
                    onClick={() => addToCart(product)}
                    size="large"
                    className={classes.addIcon}
                  >
                    <PlusIcon />
                  </IconButton>
                </div>
              </Grow>
            </Stack>
          )}
        </Stack>
      </Stack>
    </article>
  );
};
