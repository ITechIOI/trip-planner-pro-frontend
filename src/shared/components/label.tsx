import InputLabel, { type InputLabelProps } from '@mui/material/InputLabel'

export type LabelProps = InputLabelProps

export const Label = ({ className, ...props }: LabelProps) => (
  <InputLabel className={className} {...props} />
)
