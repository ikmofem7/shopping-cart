import React, { useEffect, useState } from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Checkout.css";
import Modal from "../../components/Modal";
import NormalButton from "../../components/NormalButton";
const Checkout = (props) => {
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const fetchProducts = () => {
    const selectedArray = Object.entries(props.localQuantity)
      .filter(([key, value]) => {
        if (value > 0) {
          return key;
        }
      })
      .map((item) => item[0]);
    const products = props.products.filter((product, index) => {
      if (
        selectedArray.find((item) => item === Object.keys(product).toString())
      ) {
        return product;
      }
    });
    setCheckoutProducts(products);
  };
  useEffect(() => {
    fetchProducts();
  }, [props.localQuantity, props.products]);
  return (
    <div>
      {props.backDrop ? (
        <Modal modalClose={() => {}} modal={props.modal}>
          <div className="transactionContainer">
            <FontAwesomeIcon icon={faCheckCircle} color="green" />
            <i style={{ paddingLeft: "10px" }}>Your Transaction is Completed</i>
          </div>
          <div style={{ height: "200px", overflow: "auto" }}>
            <table className="checkoutTable">
              <thead>
                <tr className="tableContent">
                  <td className="item">Item</td>
                  <td>Quantity</td>
                  <td>Subtotal</td>
                </tr>
              </thead>
              <tbody>
                {checkoutProducts.map((product) =>
                  Object.entries(product).map(([key, value]) => (
                    <tr key={key} className="tableContent">
                      <td className="item">{value.name}</td>
                      <td>{value.quantity}</td>
                      <td>{value.itemTotal}</td>
                    </tr>
                  ))
                )}
                <tr className="tableContent">
                  <td></td>
                  <td>
                    <i>
                      <b>Total</b>
                    </i>
                  </td>
                  <td>{props.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <NormalButton title="Continue Shopping" action={props.modalClose} />
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default React.memo(Checkout);
