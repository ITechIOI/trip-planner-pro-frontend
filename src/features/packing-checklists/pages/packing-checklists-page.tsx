import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import {
  useCreatePackingChecklistAction,
  useDeletePackingChecklistAction,
  useTripPackingChecklists,
  useUpdatePackingChecklistAction,
} from '../api'
import { DeleteConfirmModal } from '../components/delete-confirm-modal'
import { PackingCategoryProgress } from '../components/packing-category-progress'
import { PackingCategorySection } from '../components/packing-category-section'
import { PackingFilters } from '../components/packing-filters'
import { PackingItemModal } from '../components/packing-item-modal'
import { PackingProgress } from '../components/packing-progress'
import type {
  PackingCategory,
  PackingItem,
  RequiredStatus,
} from '../types/packing-item'

export const PackingChecklistsPage = () => {
  const tripId = 10 // TODO: replace with selected trip id from route/dashboard

  const {
    data: apiItems = [],
    isLoading: isPackingLoading,
    error: packingError,
  } = useTripPackingChecklists(tripId, undefined, {
    query: {
      enabled: Boolean(tripId),
    },
  })

  const createItemAction = useCreatePackingChecklistAction()
  const deleteItemAction = useDeletePackingChecklistAction()
  const updateItemAction = useUpdatePackingChecklistAction()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<PackingItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [packedFilter, setPackedFilter] = useState('ALL')

  const items = (apiItems as { items?: PackingItem[] }).items ?? []
  const packedCount = items.filter(
    (item) => item.packedStatus === 'PACKED',
  ).length

  const filteredItems = items.filter((item) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchSearch =
      normalizedSearch.length === 0 ||
      item.name.toLowerCase().includes(normalizedSearch)

    const matchCategory =
      categoryFilter === 'ALL' || item.category === categoryFilter

    const matchPacked =
      packedFilter === 'ALL' || item.packedStatus === packedFilter

    return matchSearch && matchCategory && matchPacked
  })

  const addItem = (values: {
    name: string
    category: PackingCategory
    quantity: number
    requiredStatus: RequiredStatus
  }) => {
    createItemAction.mutate({
      tripId,
      data: {
        ...values,
        packedStatus: 'NOT_PACKED',
      },
    })

    setIsAddModalOpen(false)
  }

  const togglePacked = (id: number) => {
    if (!tripId) return

    const currentItem = items.find((item) => item.id === id)

    if (!currentItem) return

    updateItemAction.mutate({
      tripId,
      checklistId: id,
      data: {
        name: currentItem.name,
        category: currentItem.category,
        quantity: currentItem.quantity,
        requiredStatus: currentItem.requiredStatus,
        packedStatus:
          currentItem.packedStatus === 'PACKED' ? 'NOT_PACKED' : 'PACKED',
      },
    })
  }

  const deleteItem = (id: number) => {
    const item = items.find((item) => item.id === id)

    if (!item) return

    setDeletingItem(item)
  }

  const editItem = (id: number) => {
    const item = items.find((item) => item.id === id)

    if (!item) return

    setEditingItem(item)
  }

  const saveEdit = (values: {
    name: string
    category: PackingCategory
    quantity: number
    requiredStatus: RequiredStatus
  }) => {
    if (!editingItem) return

    updateItemAction.mutate({
      tripId,
      checklistId: editingItem.id,
      data: {
        ...values,
        packedStatus: editingItem.packedStatus,
      },
    })

    setEditingItem(null)
  }

  const confirmDelete = () => {
    if (!deletingItem) return

    deleteItemAction.mutate(
      {
        tripId,
        checklistId: deletingItem.id,
      },
      {
        onSuccess: () => {
          setDeletingItem(null)
        },
      },
    )
  }

  if (isPackingLoading) {
    return <div style={{ padding: '24px' }}>Loading packing checklists...</div>
  }

  if (packingError) {
    return (
      <div style={{ padding: '24px' }}>
        <h1>Packing Checklists</h1>
        <p>Unable to load packing checklists.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#F5F7FB',
        minHeight: '100vh',
        padding: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '18px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 700,
              margin: 0,
            }}
          >
            Packing checklist
          </h1>

          <p
            style={{
              color: '#6B7280',
              marginTop: '8px',
            }}
          >
            Track and manage items for your trip
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <PackingProgress packed={packedCount} total={items.length} />

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              background: '#2563EB',
              color: 'white',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Add Item
          </button>
        </div>
      </div>

      <PackingCategoryProgress items={items} />

      <PackingFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        packedFilter={packedFilter}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onPackedChange={setPackedFilter}
      />

      {filteredItems.length === 0 ? (
        <p
          style={{
            marginTop: '24px',
            color: '#6B7280',
            textAlign: 'center',
          }}
        >
          No packing items found.
        </p>
      ) : (
        Object.entries(
          filteredItems.reduce(
            (groups, item) => {
              if (!groups[item.category]) {
                groups[item.category] = []
              }

              groups[item.category].push(item)

              return groups
            },
            {} as Record<string, PackingItem[]>,
          ),
        ).map(([category, categoryItems]) => (
          <PackingCategorySection
            key={category}
            category={category}
            items={categoryItems}
            onTogglePacked={togglePacked}
            onDelete={deleteItem}
            onEdit={editItem}
          />
        ))
      )}

      <PackingItemModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addItem}
        isSubmitting={createItemAction.isPending}
      />

      <PackingItemModal
        isOpen={Boolean(editingItem)}
        mode="edit"
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={saveEdit}
        isSubmitting={updateItemAction.isPending}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        itemName={deletingItem?.name}
        isDeleting={deleteItemAction.isPending}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
