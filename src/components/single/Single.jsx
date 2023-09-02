import ProductOrders from "./ProductOrders";
import UserOrders from "./UserOrders";
import "./single.scss";

const Single = (props) => {
  console.log("this is the props from second page =>", props);

  return (
    <div className="single ">
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {props.img && <img src={props.img} alt="" />}
            <h1>{props.title}</h1>
            {/* <button>Update</button> */}
          </div>
          <div className="details">
            <div className="details">
              <div className="details">
                {Object.entries(props.info).map(([key, value]) => (
                  <div className="item" key={key}>
                    <span className="itemTitle">{key}</span>
                    <span className="itemValue">
                      {Array.isArray(value)
                        ? value.map((item) => {
                            if (key === "color") {
                              // Handle the 'color' property
                              if (typeof item === "object") {
                                return (
                                  <div key={item._id}>
                                    {item.colorName}
                                    {item.sizes &&
                                      item.sizes.map((size) => (
                                        <span key={size._id}>
                                          {` - ${size.size} - ${size.quantity}`}{" "}
                                        </span>
                                      ))}
                                  </div>
                                );
                              } else {
                                return null;
                              }
                            } else {
                              // Handle other array properties
                              return (
                                <div key={item._id}>
                                  {Object.entries(item).map(
                                    ([subKey, subValue]) => (
                                      <div key={subKey} className="subItem">
                                        <span className="subItemTitle">{}</span>
                                        <span className="subItemValue">
                                          {Array.isArray(subValue)
                                            ? subValue.map((subItem) => (
                                                <span key={subItem._id}>
                                                  {subItem.size} -{" "}
                                                  {subItem.quantity}{" "}
                                                </span>
                                              ))
                                            : ""}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            }
                          })
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="activities">
          {props.user === "user" ? (
            <UserOrders userOrders={props.userOrder} />
          ) : (
            ""
          )}
          {props.product === "product" ? (
            <ProductOrders productOrder={props.productOrder} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Single;
