import React from "react";
import UpdateDataForm from "./UpdateDataForm";
// import UpdatePasswordForm from "./UpdatePasswordForm";
// import DeleteAccount from "./DeleteAccount";

export default function Profile() {
  return (
    <div className="my-4">
      <div className="max-w-xl bg-background rounded-xl p-4">
        <h1 className="h1">Profile</h1>
        <UpdateDataForm />
        {/* <UpdatePasswordForm />
        <DeleteAccount /> */}
      </div>
    </div>
  );
}
