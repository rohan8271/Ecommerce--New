import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import Axios from "axios";
//import Razorpay from "razorpay";
import { Link } from "react-router-dom";
//import { detailsOrder } from '../actions/orderActions';
import { deliverOrder, detailsOrder, payOrder } from "../actions/orderAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
//import { PayPalButton } from "react-paypal-button-v2";
//import { updateProducts } from "../actions/productAction";
//const key_id = "rzp_test_aEKLjl6zuBJKqc";
//const key_secret = "BVAYmBxWLIksNU3W5FDYSM9G";
//const instance = new Razorpay({ key_id, key_secret });
export default function RazorPay(props) {
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const { order, loading, error } = orderDetails;
  const [paymentId, setPaymentId] = useState("");
  const [razorId, setRazorId] = useState("");
  const [signature, setSignature] = useState("");
  const [payment, setPayment] = useState("");

  const orderPay = useSelector((state) => state.orderPay);
  // const updateProduct = useSelector((state) => state.updateProduct);
  // const cart = useSelector((state) => state.cart);
  //const { cartItems } = cart;
  // const {
  // success: successPUpdate,
  // error: errorPUpdate,
  //  loading: loadingPUpdate,
  //  } = updateProduct;
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
      // const { data } = await Axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    //const order = 1;
    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      if (successPay) {
        // alert(

        alert(
          "Payment Successfull! Stay Tuned, Shipping is in Process.Please Contact us If there is any queries related to Order and Shipping.Thank You.Happy Shopping! "
        );
        // );
      }
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(detailsOrder(orderId));
      //dispatch(updateProducts(order));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, orderId, sdkReady, successPay, successDeliver]);

  // TODO: dispatch pay order
  const successPaymentHandler = (/*paymentResult*/) => {
    dispatch(payOrder(order /*paymentResult*/));
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order._id));
  };

  const successPaymentHandlerp = (/*paymentResult*/) => {
    //dispatch(payOrder(order /*paymentResult*/));

    const options = {
      key: "rzp_test_aEKLjl6zuBJKqc", // Enter the Key ID generated from the Dashboard
      amount: order.totalPrice * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: order.shippingAddress.fullName,
      description: "Happy Shopping",
      //image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response) {
        alert(`payment id is : ${response.razorpay_payment_id}`);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
        setPaymentId(response.razorpay_payment_id);
        setRazorId(response.razorpay_order_id);

        setSignature(response.razorpay_signature);
        setPayment(true);
      },
      prefill: {
        name: order.name,
        email: "a@example.com",
        contact: "9999999999",
      },
      // notes: {
      //  address: "Razorpay Corporate Office",
      //  },
      //  theme: {
      //   color: "#3399cc",
      //   },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
  };
  useEffect(
    (paymentResult) => {
      if (payment) {
        dispatch(payOrder(order, paymentResult));
      }
    },
    [payment, dispatch]
  );

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      {order.isPaid ? (
        <h3>Payment Completed! Order Placed </h3>
      ) : (
        <h4> Payment Incomplete ! Order Processing...</h4>
      )}
      {!order.isDelivered ? <h4>Not Delivered</h4> : <h3>DELIVERED </h3>}
      <h1>Order-ID {order._id}</h1>

      <img className="ok3" alt="ok3" src="/images/razorpay.jfif" />

      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment </h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}

                  {!order.isPaid && (
                    <li>
                      <>
                        {errorPay && (
                          <MessageBox variant="danger">{errorPay}</MessageBox>
                        )}
                        {loadingPay && <LoadingBox></LoadingBox>}
                      </>
                    </li>
                  )}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                {order.paymentMethod === "Cash On Delivery" ? (
                  <div>
                    <h1>You can also Pay Now</h1>
                  </div>
                ) : (
                  <div>
                    <h1>{!order.isPaid && "Pay Now"} </h1>
                  </div>
                )}
              </li>

              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>₹{order.itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>₹{order.shippingPrice}</div>
                </div>
              </li>

              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>₹{order.totalPrice}</strong>
                  </div>
                </div>
                <li>
                  {order.isPaid ? (
                    <div className="success"> Paid With RazorPay</div>
                  ) : (
                    <div>Pay With RazorPay</div>
                  )}
                </li>
              </li>

              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <button
                        type="button"
                        onClick={successPaymentHandlerp}
                        className="primary block"
                        //disabled={cart.cartItems.length === 0}
                      >
                        <img
                          className="ok1"
                          alt="ok1"
                          src="/images/razorpay.jfif"
                        />
                      </button>
                    </>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  {errorDeliver && (
                    <MessageBox variant="danger">{errorDeliver}</MessageBox>
                  )}
                  <button
                    type="button"
                    className="primary block"
                    onClick={deliverHandler}
                  >
                    Deliver Order
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
