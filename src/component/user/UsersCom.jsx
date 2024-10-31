import React from "react";
import { users } from "../../data/users";
import UserCard from "../cards/UserCard";
import Pagination from "../teams/Pagination";

function UsersCom() {
  return (
    <div className="row">
      {users?.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
      <Pagination className={"crancy-pagination__v3"} />
    </div>
  );
}

export default UsersCom;
