import SidebarLayout from "../components/SidebarLayout";

export default function PageProfil() {

  
  return (
    <SidebarLayout title="Account Information">
      <div className="card mt-1 shadow-sm">
        <div className="card-body">
      
        <div>
          <p><strong>Full name:</strong> Test</p>
          <p><strong>Username:</strong> test</p>
          <p><strong>Email:</strong> test@email.com</p>
          <p><strong>Phone number:</strong> (514) 123-4567</p>
          <p><strong>Account status:</strong> Active</p>
        </div>

        <button className="btn btn-primary mt-3">Edit Profile</button>
        <button className="btn btn-outline-secondary mt-3 ms-2">
        Change Password
        </button>

        </div>
    </div>
    </SidebarLayout>
  );
}
