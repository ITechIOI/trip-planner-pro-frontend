import CircularProgress from '@mui/material/CircularProgress'

type PackingProgressProps = {
  packed: number
  total: number
}

export const PackingProgress = ({ packed, total }: PackingProgressProps) => {
  const progress = total === 0 ? 0 : Math.round((packed / total) * 100)

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E6ECF3',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.04)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        padding: '12px 16px',
        minWidth: '170px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={52}
          thickness={5}
          sx={{ color: '#E2E8F0', position: 'absolute' }}
        />
        <CircularProgress
          variant="determinate"
          value={progress}
          size={52}
          thickness={5}
          sx={{ color: '#0B84E5', position: 'absolute' }}
        />
        <span
          style={{
            color: '#0F172A',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {progress}%
        </span>
      </div>

      <div>
        <div
          style={{
            color: '#0F172A',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          {packed}/{total}
        </div>
        <div
          style={{
            color: '#64748B',
            fontSize: '12px',
            marginTop: '2px',
          }}
        >
          Items packed
        </div>
      </div>
    </div>
  )
}
