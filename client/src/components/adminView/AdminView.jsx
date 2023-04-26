import "./adminView.scss";

import { useEffect, useState } from "react";
import User from "./user/User";

const AdminView = ({ getAllUserDetails, allUsers }) => {
  //   const [users, setUsers] = useState([]);

  //   useEffect(() => {
  //     console.log("ADMIN VIEW USE EFFECT");
  //     const call = async () => {
  //       const res = await getAllUserDetails();
  //       setUsers(res);
  //     };

  //     call();
  //   }, []);

  return (
    <div className="admin-view">
      {allUsers.length === 0 && <h3>No registered users!</h3>}
      {allUsers?.map((user) => (
        <User
          key={user.username}
          data={user}
          getAllUserDetails={getAllUserDetails}
        />
      ))}
    </div>
  );
};

export default AdminView;
