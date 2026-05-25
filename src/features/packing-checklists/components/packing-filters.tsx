import SearchIcon from '@mui/icons-material/Search'

type PackingFiltersProps = {
  searchTerm: string
  categoryFilter: string
  packedFilter: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onPackedChange: (value: string) => void
}

const selectStyle = {
  height: '34px',
  minWidth: '126px',
  borderRadius: '10px',
  border: '1px solid #D6DEE8',
  background: '#F8FAFC',
  color: '#1E293B',
  padding: '0 12px',
  fontSize: '13px',
  outline: 'none',
}

export const PackingFilters = ({
  searchTerm,
  categoryFilter,
  packedFilter,
  onSearchChange,
  onCategoryChange,
  onPackedChange,
}: PackingFiltersProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 400px) 126px 126px',
        gap: '12px',
        alignItems: 'center',
        marginTop: '12px',
        maxWidth: '804px',
      }}
    >
      <label
        style={{
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '10px',
          border: '1px solid #D6DEE8',
          background: '#F8FAFC',
          color: '#64748B',
          padding: '0 12px',
          fontSize: '13px',
        }}
      >
        <SearchIcon sx={{ color: '#64748B', fontSize: 18 }} />
        <input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          style={{
            border: 0,
            outline: 0,
            background: 'transparent',
            color: '#0F172A',
            width: '100%',
            fontSize: '13px',
          }}
        />
      </label>

      <select
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value)}
        style={selectStyle}
      >
        <option value="ALL">All Categories</option>
        <option value="CLOTHES">Clothes</option>
        <option value="DOCUMENTS">Documents</option>
        <option value="ELECTRONICS">Electronics</option>
        <option value="MEDICINE">Medicine</option>
        <option value="PERSONAL">Personal</option>
        <option value="OTHER">Other</option>
      </select>

      <select
        value={packedFilter}
        onChange={(event) => onPackedChange(event.target.value)}
        style={selectStyle}
      >
        <option value="ALL">All Items</option>
        <option value="PACKED">Packed</option>
        <option value="NOT_PACKED">Not Packed</option>
      </select>
    </div>
  )
}
