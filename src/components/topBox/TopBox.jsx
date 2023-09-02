import "./topBox.scss";

const TopBox = ({ TopDeals }) => {
  return (
    <div className="topBox">
      <h1>Top Deals</h1>
      <div className="list">
        {TopDeals.map((user) => (
          <div className="listItem" key={user.user._id}>
            <div className="user">
              <img src={user.user.profileimg} alt="" />
              <div className="userTexts">
                <span className="username">{user.user.lname}</span>
                <span className="email">{user.user.email}</span>
              </div>
            </div>
            <span className="amount">${user.totalPrice}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBox;
