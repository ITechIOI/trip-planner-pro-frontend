import { useState, type FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { PackedStatus, RequiredStatus } from "@/shared";
import { PACKING_CATEGORY_OPTIONS } from "../lib/packing-category-meta";
import type {
  PackingCategory,
  PackingItem,
  PackingItemFormValues,
  PackedStatus as PackedStatusValue,
  RequiredStatus as RequiredStatusValue,
} from "../types/packing-item";

type PackingItemModalProps = {
  isOpen: boolean;
  mode: "add" | "edit";
  editingItem?: PackingItem | null;
  isSubmitting?: boolean;
  submitError?: string | null;
  onClose: () => void;
  onSubmit: (values: PackingItemFormValues) => void;
};

const getInitialCategory = (item?: PackingItem | null): PackingCategory =>
  item?.category ?? "OTHER";

export const PackingItemModal = ({
  isOpen,
  mode,
  editingItem,
  ...props
}: PackingItemModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <PackingItemModalContent
      key={`${mode}-${editingItem?.id ?? "new"}`}
      isOpen={isOpen}
      mode={mode}
      editingItem={editingItem}
      {...props}
    />
  );
};

const PackingItemModalContent = ({
  isOpen,
  mode,
  editingItem,
  isSubmitting = false,
  submitError,
  onClose,
  onSubmit,
}: PackingItemModalProps) => {
  const [name, setName] = useState(
    mode === "edit" ? (editingItem?.name ?? "") : "",
  );
  const [category, setCategory] = useState<PackingCategory>(
    mode === "edit" ? getInitialCategory(editingItem) : "OTHER",
  );
  const [quantity, setQuantity] = useState(
    String(mode === "edit" ? (editingItem?.quantity ?? 1) : 1),
  );
  const [requiredStatus, setRequiredStatus] = useState<RequiredStatusValue>(
    mode === "edit"
      ? (editingItem?.requiredStatus ?? RequiredStatus.OPTIONAL)
      : RequiredStatus.OPTIONAL,
  );
  const [packedStatus, setPackedStatus] = useState<PackedStatusValue>(
    mode === "edit"
      ? (editingItem?.packedStatus ?? PackedStatus.NOT_PACKED)
      : PackedStatus.NOT_PACKED,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const title = mode === "add" ? "Add Packing Item" : "Edit Packing Item";
  const submitLabel = mode === "add" ? "Add Item" : "Save Changes";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const quantityNumber = Number(quantity);

    if (!normalizedName) {
      setFormError("Item name is required.");
      return;
    }

    if (!Number.isFinite(quantityNumber) || quantityNumber < 1) {
      setFormError("Quantity must be at least 1.");
      return;
    }

    setFormError(null);
    onSubmit({
      name: normalizedName,
      category,
      quantity: quantityNumber,
      requiredStatus,
      packedStatus,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          alignItems: "flex-start",
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack spacing={0.5}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Add or update an item to your packing list.
          </Typography>
        </Stack>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack
          component="form"
          id="packing-item-form"
          spacing={2}
          onSubmit={handleSubmit}
        >
          {formError ? <Alert severity="error">{formError}</Alert> : null}
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}

          <TextField
            autoFocus
            label="Item Name"
            placeholder="e.g., Passport, T-Shirts, Sunscreen"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            required
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={category}
                disabled={isSubmitting}
                onChange={(event) =>
                  setCategory(event.target.value as PackingCategory)
                }
              >
                {PACKING_CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={isSubmitting}
              required
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
            />
          </Stack>

          <FormControl fullWidth>
            <InputLabel>Importance</InputLabel>
            <Select
              label="Importance"
              value={requiredStatus}
              disabled={isSubmitting}
              onChange={(event) =>
                setRequiredStatus(event.target.value as RequiredStatusValue)
              }
            >
              <MenuItem value={RequiredStatus.REQUIRED}>
                Required - Must bring
              </MenuItem>
              <MenuItem value={RequiredStatus.OPTIONAL}>Optional</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={packedStatus}
              disabled={isSubmitting}
              onChange={(event) =>
                setPackedStatus(event.target.value as PackedStatusValue)
              }
            >
              <MenuItem value={PackedStatus.NOT_PACKED}>Not Packed</MenuItem>
              <MenuItem value={PackedStatus.PACKED}>Packed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="packing-item-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
