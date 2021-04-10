import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, listOrders } from "../actions/orderAction";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ORDER_DELETE_RESET } from "../constants/orderConstants";

export default function OrderListScreen(props) {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders());
  }, [dispatch, successDelete]);
  const deleteHandler = (order) => {
    if (window.confirm("Are you sure you want to delete?")) {
      dispatch(deleteOrder(order._id));
    }
  };
  return (
    <div>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>PAYMENT METHOD</th>

              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    <div className="success">
                      {order.isPaid
                        ? `YES  -  (Paid at ${order.paidAt.substring(0, 10)})`
                        : "NO"}
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
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
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
