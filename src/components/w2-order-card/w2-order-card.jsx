import cls from "./w2-order-card.module.css";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import AddFillIcon from "remixicon-react/AddFillIcon";
import { useCartContext } from "../../context/cart/provider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatPrice } from "../../utils/format-price";

export const W2OrderCard = ({ data, disabled }) => {
  const { removeItem, toggleAmount } = useCartContext();

  return (
    <div className={cls.row}>
      <div className={cls.col}>
        <h4 className={cls.title}>
          {data?.translation.title}{" "}
          {data.bonus && <span className={cls.red}>Bonus</span>}
        </h4>
        <p className={cls.desc}>
          {data.addons
            ?.map(
              (item) =>
                item.stock?.product?.translation?.title + " x " + item.quantity,
            )
            .join(", ")}
        </p>
        <div className={cls.actions}>
          {!disabled && (
            <div className={cls.counter}>
              <button
                type="button"
                className={`${cls.counterBtn}`}
                onClick={(e) => {
                  e.stopPropagation();
                  data?.stock.amount <= 1
                    ? removeItem(data.stock.id)
                    : toggleAmount(data.stock.id, "dec");
                }}
              >
                <SubtractFillIcon />
              </button>
              <div className={cls.count}>{data.stock.amount}</div>
              <button
                type="button"
                className={`${cls.counterBtn}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAmount(data.stock.id, "inc");
                }}
              >
                <AddFillIcon />
              </button>
            </div>
          )}
          <div className={cls.price}>
            {!!data.discount && (
              <span className={cls.oldPrice}>
                {formatPrice(data.stock.price)}
              </span>
            )}
            {formatPrice(data.stock?.total_price)}
          </div>
        </div>
      </div>
      <div className={cls.imageWrapper}>
        <LazyLoadImage src={data?.img} alt={data?.translation.title} />
      </div>
    </div>
  );
};
