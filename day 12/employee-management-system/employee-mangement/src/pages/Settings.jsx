export default function Settings() {
  return (
    <div className="settings-page">

      <h2>Settings</h2>

      <div className="settings-card">

        <h3>Admin Information</h3>

        <div className="setting-item">
          <label>Admin Name</label>
          <input
            type="text"
            value="Admin"
            readOnly
          />
        </div>

        <div className="setting-item">
          <label>Email</label>
          <input
            type="email"
            value="admin@gmail.com"
            readOnly
          />
        </div>

        <div className="setting-item">
          <label>Company</label>
          <input
            type="text"
            value="Employee Management System"
            readOnly
          />
        </div>

        <button className="save-btn">
          Save Changes
        </button>

      </div>

    </div>
  );
}