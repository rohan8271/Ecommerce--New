import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrderH } from "../actions/orderAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

export default function OrderHistoryScreen(props) {
  const orderHList = useSelector((state) => state.orderHList);
  const { loading, error, orders } = orderHList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderH());
  }, [dispatch]);
  return (
    <div>
      <h1>Order History</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>

              <th>PAYMENT METHOD</th>
              <th>DELIVERED</th>
              <th>SEE ORDER DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    <div className="success">
                      {`YES  -  (Paid at ${order.paidAt.substring(0, 10)})`}
                    </div>
                  ) : (
                    <div className="danger">NO</div>
                  )}
                </td>

                <td> {order.paymentMethod}</td>
                <td>
                  {order.isDelivered ? (
                    <div className="success">
                      {`YES  -  (Delivered at ${order.deliveredAt.substring(
                        0,
                        10
                      )})`}
                    </div>
                  ) : (
                    <div className="danger">NO</div>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      if (order.paymentMethod === "Cash On Delivery") {
                        props.history.push(`/orderc/${order._id}`);
                      } else if (order.paymentMethod === "RazorPay") {
                        props.history.push(`/orderr/${order._id}`);
                      } else {
                        props.history.push(`/order/${order._id}`);
                      }
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
