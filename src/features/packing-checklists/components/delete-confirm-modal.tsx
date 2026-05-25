import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

type DeleteConfirmModalProps = {
  isOpen: boolean
  itemName?: string
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmModal = ({
  isOpen,
  itemName,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
      }}
    >
      <div
        style={{
          width: '380px',
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(15,23,42,0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <h2 style={{ margin: 0 }}>Delete Item?</h2>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#64748B',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
            title="Close"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <p style={{ color: '#6B7280' }}>
          Are you sure you want to delete <strong>{itemName}</strong>? This
          action cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              background: '#EF4444',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
