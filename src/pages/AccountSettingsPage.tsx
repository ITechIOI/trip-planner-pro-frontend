import { useState } from 'react'
import '../App.css'

// Kiểu dữ liệu cho thông tin cá nhân của user.
// Dùng TypeScript để kiểm soát field nào được phép có trong user profile.
type UserProfile = {
  fullName: string
  email: string
  phone: string
}

// Dữ liệu giả để dựng UI trước.
// Sau này khi nối API, phần này sẽ được thay bằng useCurrentUser().
const initialUserProfile: UserProfile = {
  fullName: "Sixstar's Member",
  email: 'member.sixstar@email.com',
  phone: '+1 (555) 123-4567',
}

export const AccountSettingsPage = () => {
  // profile là dữ liệu đang hiển thị chính thức trên giao diện.
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile)

  // formData là dữ liệu tạm thời khi người dùng đang chỉnh sửa form.
  // Nếu bấm Cancel thì formData bị bỏ, profile không thay đổi.
  const [formData, setFormData] = useState<UserProfile>(initialUserProfile)

  // isEditing dùng để chuyển giữa chế độ xem thông tin và chế độ chỉnh sửa.
  const [isEditing, setIsEditing] = useState(false)

  // showConfirmModal dùng để bật/tắt modal xác nhận trước khi lưu thay đổi.
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // successMessage dùng để hiển thị thông báo xanh sau khi cập nhật thành công.
  const [successMessage, setSuccessMessage] = useState('')

    // showPasswordModal dùng để bật/tắt modal đổi mật khẩu.
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // showConfirmPasswordModal dùng để bật/tắt modal xác nhận đổi mật khẩu.
  // Theo yêu cầu, khi bấm Save Password thì chưa lưu ngay mà phải hỏi xác nhận trước.
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false)

  // passwordForm lưu dữ liệu người dùng nhập trong form đổi mật khẩu.
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  })

  // showCurrentPassword và showNewPassword dùng để hiện/ẩn mật khẩu.
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Hàm này chạy khi người dùng bấm nút Edit.
  // Nó đưa formData về đúng dữ liệu hiện tại và bật chế độ chỉnh sửa.
  const handleEdit = () => {
    setFormData(profile)
    setIsEditing(true)
    setSuccessMessage('')
  }

  // Hàm này chạy khi người dùng bấm Cancel.
  // Nó hủy thay đổi đang nhập và quay về chế độ xem.
  const handleCancelEdit = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  // Hàm này chạy khi người dùng bấm Save Changes.
  // Chưa lưu ngay, chỉ mở modal xác nhận theo yêu cầu Figma.
  const handleRequestSave = () => {
    setShowConfirmModal(true)
  }

  // Hàm này chạy khi người dùng bấm Confirm Change trong modal.
  // Hiện tại chỉ lưu vào state local; sau này sẽ gọi API update profile ở đây.
  const handleConfirmSave = () => {
    setProfile(formData)
    setIsEditing(false)
    setShowConfirmModal(false)
    setSuccessMessage('Your information has been updated successfully!')
  }

  // Hàm này dùng chung cho các input Full Name, Email, Phone.
  // Khi người dùng gõ, formData sẽ được cập nhật theo name của input.
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

    // Hàm này chạy khi người dùng bấm nút Change Password.
  // Nó mở modal đổi mật khẩu và reset dữ liệu cũ trong form.
  const handleOpenPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
    })
    setShowPasswordModal(true)
    setSuccessMessage('')
  }

  // Hàm này chạy khi người dùng bấm Cancel hoặc nút X trong modal đổi mật khẩu.
  // Nó đóng modal và không cập nhật gì.
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
    })
  }

  // Hàm này chạy khi người dùng bấm Save Password.
  // Chưa lưu ngay, chỉ mở modal xác nhận đổi mật khẩu.
  const handleRequestPasswordSave = () => {
    setShowConfirmPasswordModal(true)
  }

  // Hàm này chạy khi người dùng xác nhận đổi mật khẩu.
  // Hiện tại chỉ xử lý UI local; sau này sẽ gọi API update password tại đây.
  const handleConfirmPasswordSave = () => {
    setShowConfirmPasswordModal(false)
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
    })
    setSuccessMessage('Your password has been updated successfully!')
  }

  // Điều kiện đơn giản để bật nút Save Password:
  // current password không được rỗng và new password tối thiểu 8 ký tự.
  const canSavePassword =
    passwordForm.currentPassword.trim().length > 0 &&
    passwordForm.newPassword.trim().length >= 8

  return (
    <div className="account-settings-page">
      {/* Header: phần trên cùng của trang, gồm logo và menu user */}
      <header className="as-header">
        <div className="as-logo-wrap">
          <div className="as-logo">✈</div>
          <span className="as-brand">
            <span>TRIP PLANNER</span> PRO
          </span>
        </div>

        <button className="as-user-button" type="button">
          <span className="as-user-avatar-small">SJ</span>
          <span>{profile.fullName}</span>
          <span>⌄</span>
        </button>
      </header>

      {/* Main: phần nội dung chính của trang Account Settings */}
      <main className="as-main">
        <section className="as-title-section">
          <h1>Account Settings</h1>
          <p>Manage your personal information and account preferences</p>
        </section>

        {/* Success notification: chỉ hiện sau khi user lưu thông tin thành công */}
        {successMessage && (
          <div className="as-success-alert">
            <span className="as-success-icon">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        <section className="as-content">
          {/* Card bên trái: hiển thị tóm tắt thông tin user */}
          <aside className="as-profile-card">
            <div className="as-avatar-wrap">
              <div className="as-avatar">SJ</div>
              <span className="as-online-dot" />
            </div>

            <h2>{profile.fullName}</h2>
            <p className="as-role">Premium Traveler</p>

            <div className="as-divider" />

            <div className="as-stats">
              <div>
                <strong>12</strong>
                <span>Trips Planned</span>
              </div>
              <div>
                <strong>8</strong>
                <span>Journeys</span>
              </div>
            </div>

            <div className="as-divider" />

            <div className="as-contact-list">
              <div className="as-contact-item">
                <span className="as-icon">✉</span>
                <span>{profile.email}</span>
              </div>
              <div className="as-contact-item">
                <span className="as-icon">☎</span>
                <span>{profile.phone}</span>
              </div>
              <div className="as-contact-item">
                <span className="as-icon">⌖</span>
                <span>TP. Ho Chi Minh, Vietnam</span>
              </div>
            </div>
          </aside>

          <div className="as-right-column">
            {/* Card bên phải: thông tin cá nhân có thể chỉnh sửa */}
            <section className="as-card as-info-card">
              <div className="as-card-header">
                <h2>Personal Information</h2>

                {/* Khi chưa edit thì hiện nút Edit; khi đang edit thì ẩn nút Edit */}
                {!isEditing && (
                  <button
                    className="as-edit-button"
                    type="button"
                    onClick={handleEdit}
                  >
                    ✎ Edit
                  </button>
                )}
              </div>

              <div className="as-form-group">
                <label htmlFor="fullName">♙ Full Name</label>
                <input
                  id="fullName"
                  value={isEditing ? formData.fullName : profile.fullName}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    handleInputChange('fullName', event.target.value)
                  }
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="email">✉ Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={isEditing ? formData.email : profile.email}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    handleInputChange('email', event.target.value)
                  }
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="phone">☎ Phone Number</label>
                <input
                  id="phone"
                  value={isEditing ? formData.phone : profile.phone}
                  readOnly={!isEditing}
                  onChange={(event) =>
                    handleInputChange('phone', event.target.value)
                  }
                />
              </div>

              {/* Chỉ hiện Cancel và Save Changes khi đang ở chế độ chỉnh sửa */}
              {isEditing && (
                <div className="as-form-actions">
                  <button
                    className="as-cancel-button"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>

                  <button
                    className="as-save-button"
                    type="button"
                    onClick={handleRequestSave}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </section>

            {/* Card thao tác tài khoản */}
            <section className="as-card as-actions-card">
              <h2>Account Actions</h2>

              <div className="as-actions">
                {/* <button className="as-secondary-button" type="button">
                  🔒 Change Password
                </button> */}
                
                <button
                className="as-secondary-button"
                type="button"
                onClick={handleOpenPasswordModal}
                >
                🔒 Change Password
                </button>              

                <button className="as-danger-button" type="button">
                  🗑 Delete Account
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* Footer: phần cuối trang, copy style theo UI Kit */}
      <footer className="as-footer">
        <div>
          <div className="as-footer-brand">
            <div className="as-logo as-logo-footer">✈</div>
            <strong>Trip Planner Pro</strong>
          </div>
          <p>Plan smarter, travel better.</p>
          <small>© 2026 Trip Planner Pro. All rights reserved.</small>
        </div>

        <div className="as-footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
          <span>Contact Support</span>
        </div>

        <span className="as-version">Version v1.0.0</span>
      </footer>

      {/* Modal xác nhận lưu thông tin cá nhân.
          Modal này chỉ hiện khi showConfirmModal = true. */}
      {showConfirmModal && (
        <div className="as-modal-overlay">
          <div className="as-confirm-modal">
            <h2>Confirm Information Change</h2>
            <p>Are you sure you want to change your personal information?</p>

            <div className="as-modal-actions">
              <button
                className="as-cancel-button"
                type="button"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>

              <button
                className="as-save-button"
                type="button"
                onClick={handleConfirmSave}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Modal đổi mật khẩu.
          Modal này xuất hiện khi người dùng bấm Change Password.
          Theo UI requirement, modal cần có Current Password, New Password,
          nút Cancel và Save Password. */}
      {showPasswordModal && (
        <div className="as-modal-overlay">
          <div className="as-password-modal">
            <div className="as-password-modal-header">
              <div className="as-password-title-wrap">
                <span className="as-password-icon">🔒</span>
                <div>
                  <h2>Change Password</h2>
                  <p>
                    Enter your current password and choose a new secure
                    password.
                  </p>
                </div>
              </div>

              <button
                className="as-close-button"
                type="button"
                onClick={handleClosePasswordModal}
                aria-label="Close password modal"
              >
                ×
              </button>
            </div>

            <div className="as-password-form">
              <div className="as-form-group">
                <label htmlFor="currentPassword">Current Password</label>

                <div className="as-password-input-wrap">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: event.target.value,
                      }))
                    }
                  />

                  <button
                    className="as-eye-button"
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword((prevValue) => !prevValue)
                    }
                    aria-label="Toggle current password visibility"
                  >
                    {showCurrentPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="as-form-group">
                <label htmlFor="newPassword">New Password</label>

                <div className="as-password-input-wrap">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                  />

                  <button
                    className="as-eye-button"
                    type="button"
                    onClick={() =>
                      setShowNewPassword((prevValue) => !prevValue)
                    }
                    aria-label="Toggle new password visibility"
                  >
                    {showNewPassword ? '🙈' : '👁'}
                  </button>
                </div>

                <small className="as-password-hint">
                  Password must be at least 8 characters long.
                </small>
              </div>
            </div>

            <div className="as-modal-actions">
              <button
                className="as-cancel-button"
                type="button"
                onClick={handleClosePasswordModal}
              >
                Cancel
              </button>

              <button
                className="as-save-button"
                type="button"
                disabled={!canSavePassword}
                onClick={handleRequestPasswordSave}
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal xác nhận đổi mật khẩu.
          Modal này xuất hiện sau khi bấm Save Password.
          Mục đích là hỏi lại người dùng trước khi lưu mật khẩu mới. */}
      {showConfirmPasswordModal && (
        <div className="as-modal-overlay as-modal-overlay-top">
          <div className="as-confirm-modal">
            <h2>Confirm Password Change</h2>
            <p>
              Are you sure you want to change your password? You will need to
              use your new password the next time you log in.
            </p>

            <div className="as-modal-actions">
              <button
                className="as-cancel-button"
                type="button"
                onClick={() => setShowConfirmPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                className="as-save-button"
                type="button"
                onClick={handleConfirmPasswordSave}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}