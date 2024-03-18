import { useEffect, useState } from "react";
import cls from "./extrasForm.module.css";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import AddFillIcon from "remixicon-react/AddFillIcon";
import Checkbox from "@mui/material/Checkbox";
import { formatPrice } from "../../utils/format-price";
import { CheckboxInput } from "../checkbox-input";

export default function AddonsItem({
  data,
  quantity,
  selectedValues,
  handleChange,
  type,
}) {
  const checked = !!selectedValues.find((item) => item.id === String(data.id));
  const [counter, setCounter] = useState(checked ? quantity : 0);

  function reduceCounter() {
    setCounter((prev) => prev - 1);
  }

  function addCounter() {
    setCounter((prev) => prev + 1);
  }

  useEffect(() => {
    handleChange(data, counter);
  }, [counter]);

  return (
    <div className={cls.checkboxGroup}>
      {type === "w2" ? (
        <CheckboxInput
          id={String(data.id)}
          name={String(data.id)}
          checked={checked}
          onChange={(event) => setCounter(event.target.checked ? quantity : 0)}
        />
      ) : (
        <Checkbox
          id={String(data.id)}
          name={String(data.id)}
          checked={checked}
          onChange={(event) => setCounter(event.target.checked ? quantity : 0)}
        />
      )}
      {checked && (
        <div className={cls.counter}>
          <button
            className={cls.btn}
            disabled={counter === 0}
            onClick={reduceCounter}
          >
            <SubtractFillIcon />
          </button>
          <span className={cls.text}>{counter}</span>
          <span className={cls.symbol}> x </span>
          <button
            className={cls.btn}
            disabled={counter === data.product?.stock?.quantity}
            onClick={addCounter}
          >
            <AddFillIcon />
          </button>
        </div>
      )}
      <label className={cls.label} htmlFor={String(data.id)}>
        <span className={cls.text}>{data?.product?.translation.title}</span>
        <span className={cls.mute}>
          {formatPrice(data?.product?.stock?.total_price)}
        </span>
      </label>
    </div>
  );
}
