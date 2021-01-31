import axios from "axios";
import React, { Component } from "react";
import "./ShoppingCart.css";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Checkout from "./Checkout/Checkout";
import IconButton from "../components/IconButton";
import NormalButton from "../components/NormalButton";
import FloatingBottom from "../components/FloatingBottom";
import ImageContainer from "../components/ImageContainer";

class ShoppingCart extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      quantity: 0,
      localQuantity: {},
      total: 0,
      localTotal: {},
      modal: false,
      backDrop: false,
      checkoutData: null,
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }
  fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://shopping-cart-405ea-default-rtdb.firebaseio.com/products.json"
      );
      let products = [];
      for (let key in response.data) {
        products.push({ [key]: response.data[key] });
      }
      this.setState({
        products: products,
      });
    } catch (error) {
      console.log(error);
      let errorMessage = error.toString().replace(/Error: /g, "");
      this.setState({ errorMessage: errorMessage });
      console.log(error);
    }
  };

  addTotal = (key, index) => {
    const totalQuantity = Object.values(this.state.localQuantity).reduce(
      (total, number) => total + number
    );
    const total = Object.values(this.state.localTotal).reduce(
      (total, number) => total + number
    );
    this.setState({
      quantity: totalQuantity,
      total: total,
    });
  };

  addPrice = (key, index) => {
    const products = [...this.state.products];
    products[index][key].quantity = products[index][key].quantity + 1;
    products[index][key].itemTotal =
      products[index][key].itemTotal + products[index][key].discountPrice;
    const localQuantity = { ...this.state.localQuantity };
    if (localQuantity[key] === undefined) {
      localQuantity[key] = 1;
    } else {
      localQuantity[key] = this.state.localQuantity[key] + 1;
    }
    const localTotal = { ...this.state.localTotal };
    if (localTotal[key] === undefined) {
      localTotal[key] = products[index][key].discountPrice;
    } else {
      localTotal[key] =
        this.state.localTotal[key] + products[index][key].discountPrice;
    }
    this.setState(
      {
        localQuantity: localQuantity,
        localTotal: localTotal,
        products: products,
      },
      () => this.addTotal(key, index)
    );
  };

  reduceTotal = () => {
    const totalQuantity = Object.values(this.state.localQuantity).reduce(
      (total, number) => total + number
    );
    const total = Object.values(this.state.localTotal).reduce(
      (total, number) => total + number
    );
    this.setState({ quantity: totalQuantity, total: total });
  };

  reducePrice = (key, index) => {
    const totalQuantity = Object.values(this.state.localQuantity).reduce(
      (total, number) => total + number
    );
    if (totalQuantity > 0 && this.state.localQuantity[key] > 0) {
      const products = [...this.state.products];
      products[index][key].quantity = products[index][key].quantity - 1;
      products[index][key].itemTotal =
        products[index][key].itemTotal - products[index][key].discountPrice;
      const localQuantity = { ...this.state.localQuantity };
      localQuantity[key] = this.state.localQuantity[key] - 1;
      const localTotal = { ...this.state.localTotal };
      localTotal[key] =
        this.state.localTotal[key] - products[index][key].discountPrice;
      this.setState(
        {
          localQuantity: localQuantity,
          localTotal: localTotal,
          products: products,
        },
        () => this.reduceTotal()
      );
    } else {
      if (totalQuantity === 0) {
        alert("Your cart is empty");
      } else {
        alert("You need to add this item");
      }
      return;
    }
  };

  checkout = () => {
    const totalQuantity = Object.values(this.state.localQuantity).reduce(
      (total, number) => total + number
    );
    if (totalQuantity <= 0) {
      alert("Your cart is empty");
    } else {
      this.setState({ backDrop: true, modal: true });
    }
  };

  modalClose = async () => {
    await this.fetchProducts();
    this.setState({
      modal: false,
      quantity: 0,
      localQuantity: {},
      total: 0,
      localTotal: {},
    });
    setTimeout(() => {
      this.setState({ backDrop: false });
    }, 500);
  };

  render() {
    return (
      <div>
        {this.state.backDrop ? (
          <Checkout
            backDrop={this.state.backDrop}
            modalClose={this.modalClose}
            modal={this.state.modal}
            products={this.state.products}
            localQuantity={this.state.localQuantity}
            total={this.state.total}
          />
        ) : null}
        <div className="productContainer">
          <h2>Groceries</h2>
          <div className="cardView customWidth">
            {this.state.products.length > 0 ? (
              this.state.products.map((product, index) =>
                Object.entries(product).map(([key, value]) => (
                  <div key={key} className="product">
                    <ImageContainer
                      imgUrl={value.imgUrl}
                      name={value.name}
                      offer={value.offer}
                    />
                    <div className="productContentContainer">
                      <p className="name">{value.name}</p>
                      <p className="description">{value.description}</p>
                      <p className="description">{value.type}</p>
                      <p className="description">MRP {value.price}</p>
                      <p className="discountPrice">Rs {value.discountPrice}</p>
                      <div className="buttonContainer">
                        <NormalButton
                          title="add cart"
                          action={() => this.addPrice(key, index)}
                        />
                        <div className="iconConatiner">
                          <IconButton
                            iconName={faMinus}
                            action={() => this.reducePrice(key, index)}
                          />
                          <p style={{ padding: "0px 10px" }}>
                            {this.state.localQuantity[key]
                              ? this.state.localQuantity[key]
                              : 0}
                          </p>
                          <IconButton
                            iconName={faPlus}
                            action={() => this.addPrice(key, index)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <p>
                  {this.state.errorMessage
                    ? this.state.errorMessage
                    : "Please Wait..."}
                </p>
              </div>
            )}
            {this.state.errorMessage ? null : (
              <FloatingBottom
                quantity={this.state.quantity}
                total={this.state.total}
                action={this.checkout}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ShoppingCart;
